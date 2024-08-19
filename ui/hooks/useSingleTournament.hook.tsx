"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { notFound } from "next/navigation";
import Context from "@/ui/providers/NavbarContext.provider";
import {
  useUpdateCurrentSet,
  useUpdateGemScore,
  useUpdateMatchStatus,
  useUpdateMatchWinner,
  useUpdateTieScore,
} from "@/infrastructure/mutations/tournaments";
import { database } from "@/lib/firebaseConfig";
import { onValue, ref } from "firebase/database";
import { scores } from "@/lib/helpers/score";
import { TournamentType } from "@/interfaces/tournaments";

type ParamsType = {
  team: number;
  path: string;
  action: "plus" | "minus";
  advIndex?: number;
};

type HandleUpdateType = {
  team: number;
  path: string;
  action: "plus" | "minus";
};

const DEFAULT_MATCH_TYPE = {
  setDuration: 3,
  gemDuration: 6,
  tieBreakDuration: 7,
};

export default function useSingleTournament({ id }: { id: string }) {
  const { tournament, setTournament } = useContext<{
    tournament: TournamentType;
    setTournament: (tournament: TournamentType | null) => void;
  }>(Context);

  const isMounted = useRef(false);

  const [state, setState] = useState({
    score: tournament?.score?.currentSet || [0, 0],
    gemScore: tournament?.score?.sets[tournament?.score?.sets.length - 1] || [
      0, 0,
    ],
    tieBreakScore: tournament?.score?.tiebreak || [0, 0],
    currentSet: tournament?.score?.sets[tournament?.score?.sets.length - 1] || [
      0, 0,
    ],
    tie: false,
    matchType: DEFAULT_MATCH_TYPE,
    winner: null as null | "host" | "guest",
    params: null as ParamsType | null,
  });

  const { mutate: updateMatchScore } = useUpdateCurrentSet();
  const { mutate: updateGemScore } = useUpdateGemScore();
  const { mutate: updateTieScore } = useUpdateTieScore();
  const { mutate: updateMatchWinner } = useUpdateMatchWinner();
  const { mutate: updateStatus } = useUpdateMatchStatus();

  function checkWinner() {
    const { sets, tiebreak } = tournament?.score || {};
    const lastSet = sets?.[sets.length - 1];
    const total = checkTotalPlayedSets();
    const t = lastSet?.some((n) => n > 8);

    if (tournament?.type === 0 && total.total === 3) {
      setState((prev) => ({
        ...prev,
        winner:
          total.player1 >= state.matchType.setDuration - 1 ? "host" : "guest",
      }));
    } else if (tournament?.type === 1) {
      if (total.player1 === 2) {
        setState((prev) => ({ ...prev, winner: "host" }));
      } else if (total.player2 === 2) {
        setState((prev) => ({ ...prev, winner: "guest" }));
      } else if (total.total === 3) {
        setState((prev) => ({
          ...prev,
          winner: total.player1 > total.player2 ? "host" : "guest",
        }));
      }
    } else if (tournament?.type === 2 && t) {
      setState((prev) => ({
        ...prev,
        winner: total.player1 > total.player2 ? "host" : "guest",
      }));
    }
  }

  function checkTotalPlayedSets() {
    const { sets } = tournament?.score || {};
    let player1Sets = 0;
    let player2Sets = 0;

    if (sets) {
      for (const [player1Score, player2Score] of sets) {
        if (player1Score > player2Score) player1Sets++;
        else if (player2Score > player1Score) player2Sets++;
      }
    }

    return {
      player1: player1Sets,
      player2: player2Sets,
      total: player1Sets + player2Sets,
    };
  }

  function addNewSet(setsLength: number, team: number) {
    setState((prev) => ({ ...prev, tieBreakScore: [0, 0] }));

    if (setsLength === state.matchType.setDuration) return;

    Array.from({ length: 2 }).forEach((_, i) =>
      updateGemScore({
        id,
        team: i,
        gem: setsLength,
        score: 0,
        prevScore: [0, 0],
      })
    );
  }

  function resetTieScore(team: number) {
    updateTieScore({
      id,
      team,
      prevScore: [0, 0],
      score: 0,
    });
  }

  function checkIsTieBreak() {
    const bothAtLastGem = state.currentSet.every(
      (teamScore) => teamScore >= state.matchType.gemDuration
    );
    const bothAtLastGemMinus1 = state.currentSet.every(
      (teamScore) => teamScore >= state.matchType.gemDuration - 1
    );
    const totalSetsLen = tournament?.score?.sets?.length;

    if (!state.winner) {
      if (tournament?.type === 2 && bothAtLastGemMinus1) return true;
      if (tournament?.type === 1 && (bothAtLastGem || totalSetsLen === 3))
        return true;
      if (tournament?.type === 0 && bothAtLastGem) return true;
    }

    return false;
  }

  const handleUpdateCurrentSetScore = ({
    action,
    path,
    team,
  }: HandleUpdateType) => {
    setState((prev) => ({
      ...prev,
      params: { action, path, team },
    }));

    const updateScore = (score: number) => {
      if (action === "minus" && score !== 0) return score - 1;
      if (action === "plus" && score < scores.length - 1) return score + 1;
      return score;
    };

    if (state.tie) {
      setState((prev) => ({
        ...prev,
        tieBreakScore: {
          ...prev.tieBreakScore,
          [team]: updateScore(prev.tieBreakScore[team]),
        },
      }));
    } else {
      setState((prev) => ({
        ...prev,
        score: prev.score.map((n, i) => (i === team ? updateScore(n) : n)),
      }));
    }
  };

  useEffect(() => {
    const team = state.params?.team;
    const bothAdvantage = state.score.every((n) => n === 4);
    const playerWonGem =
      state.score[team!] > 3 &&
      state.score.reduce((a, b) => Math.abs(a - b), 0) > 1;

    if (playerWonGem) {
      state.score.forEach((_, i) => {
        updateMatchScore({
          id,
          team: i,
          score: 0,
        });
      });
      // @ts-ignore
      handleGemPoints({ team });
    } else if (bothAdvantage) {
      state.score.forEach((_, i) => {
        updateMatchScore({
          id,
          team: i,
          score: 3, // Index of point for 40
        });
      });
    } else {
      updateMatchScore({
        id,
        team,
        score: state.score[team!],
      });
    }
  }, [state.score]);

  function handleGemPoints({ team }: { team: number }) {
    const { sets } = tournament?.score || {};
    const updatedTeam = state.currentSet[team];

    if (state.gemScore[team] >= state.matchType.gemDuration) {
      addNewSet(sets?.length || 0, team);
    } else {
      updateGemScore({
        id,
        team,
        gem: sets?.length! - 1,
        score: updatedTeam !== undefined ? updatedTeam + 1 : 0,
        prevScore: state.currentSet,
      });
    }
  }

  function handleTiePoints({ team }: { team: number }) {
    const { sets } = tournament?.score || {};
    const updatedTeam = state.currentSet[team];
    const playerWonTieBreak =
      state.tieBreakScore[team] >= state.matchType.tieBreakDuration &&
      Object.values(state.tieBreakScore).reduce((a, b) => Math.abs(a - b), 0) >
        1;

    if (playerWonTieBreak) {
      updateGemScore({
        id,
        team,
        gem: sets?.length! - 1,
        score: updatedTeam !== undefined ? updatedTeam + 1 : 0,
        prevScore: state.currentSet,
      });

      resetTieScore(team);
      addNewSet(sets?.length || 0, team);
    } else {
      updateTieScore({
        id,
        team,
        prevScore: state.tieBreakScore,
        score: state.tieBreakScore[team],
      });
    }
  }

  useEffect(() => {
    if (state.params?.team !== undefined) {
      handleTiePoints({ team: state.params.team });
    }
  }, [state.tieBreakScore]);

  useEffect(() => {
    if (tournament) {
      setState((prev) => ({
        ...prev,
        matchType: {
          setDuration: tournament.type === 2 ? 1 : 3,
          gemDuration: tournament.type === 2 ? 9 : 6,
          tieBreakDuration: tournament.superTieBreak ? 10 : 7,
        },
      }));
      checkWinner();
      setState((prev) => ({ ...prev, tie: checkIsTieBreak() }));
    }
  }, [tournament]);

  useEffect(() => {
    if (state.winner) {
      updateMatchWinner({ gameId: id, winner: state.winner });

      if (!isMounted.current) {
        updateStatus({ id, status: { id: 0, status: "completed" } });
      }
      isMounted.current = true;
    }
  }, [state.winner]);

  useEffect(() => {
    const tournamentsRef = ref(database, `tournaments/${id}`);

    const unsubscribe = onValue(tournamentsRef, (snapshot) => {
      const data: TournamentType = snapshot.val();
      if (!data) {
        setTournament(null);
        notFound();
        return;
      }

      setState((prev) => ({
        ...prev,
        score: data.score?.currentSet || [0, 0],
        gemScore: data.score?.sets[data.score.sets.length - 1] || [0, 0],
        currentSet: data.score?.sets[data.score?.sets.length - 1] || [0, 0],
      }));
      setTournament(data);
    });

    return () => unsubscribe();
  }, [id, setTournament]);

  return { tie: state.tie, tournament, handleUpdateCurrentSetScore };
}
