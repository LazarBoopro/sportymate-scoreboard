"use client";

import { useContext, useEffect, useState } from "react";
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

import { TournamentType } from "@/interfaces/tournaments";

export default function useSingleTournament({ id }: { id: string }) {
  //  Context
  const { tournament, setTournament } = useContext<{
    tournament: TournamentType;
    setTournament: CallableFunction;
  }>(Context);

  // States
  const [params, setParams] = useState<null | number>(null);
  const [matchType, setMatchType] = useState({
    setDuration: 2,
    gemDuration: 7,
    tieBreakDuration: 7,
  });
  const [tieBreak, setTieBreak] = useState(false);

  // Queries and Mutations
  const { mutate: updateMatchScore, isSuccess: isSuccessCurrentMatchScore } =
    useUpdateCurrentSet();
  const { mutate: updateGemScore, isSuccess: isSuccessCurrentGemScore } =
    useUpdateGemScore();
  const { mutate: updateTieScore, isSuccess: isSuccessCurrentTieBreakScore } =
    useUpdateTieScore();
  const { mutate: updateMatchWinner } = useUpdateMatchWinner();
  const { mutate: updateStatus, isSuccess: isSuccessStatus } =
    useUpdateMatchStatus();

  const currentGem = tournament?.score?.currentSet;
  const setsLength = tournament?.score?.sets?.length;
  const currentSet = tournament?.score?.sets[setsLength! - 1];
  const playerWonGem =
    currentGem?.[params!]! > 3 &&
    currentGem?.reduce((a, b) => Math.abs(a - b), 0)! > 1;
  const type = +tournament?.type;
  const tieBreakScore = tournament?.score?.tiebreak;

  // Functions
  function handleUpdateCurrentSetScore({
    team,
    action,
  }: {
    team: number;
    action: "plus" | "minus";
  }) {
    setParams(team);

    if (tieBreak) {
      handleUpdateCurrentTieBreakScore({
        team,
        action,
      });
      return;
    }

    if (action === "minus" && currentGem?.[team]! > 0) {
      updateMatchScore({
        id,
        team,
        score: tournament?.score?.currentSet[team]! - 1,
      });

      return;
    }

    if (action === "plus" && currentGem?.[team]! <= 4) {
      updateMatchScore({
        id,
        team,
        score: tournament?.score?.currentSet[team]! + 1,
      });

      return;
    }
  }

  useEffect(() => {
    if (playerWonGem) {
      Array.from({ length: 2 }).map((_, i) => {
        updateMatchScore({
          id,
          team: i,
          score: 0,
        });
      });

      handleGemPoint(params!);

      return;
    }

    if (currentGem?.every((n) => n === 4)) {
      Array.from({ length: 2 }).map((_, i) =>
        updateMatchScore({
          id,
          team: i,
          score: 3,
        })
      );
    }
  }, [isSuccessCurrentMatchScore]);

  // GEMS
  function handleGemPoint(team: number) {
    const sets = tournament?.score?.sets;
    const currentSet = sets?.[sets?.length - 1];
    const updatedTeam = currentSet?.[team];

    checkTotalPlayingSets();

    if (
      type !== 2 &&
      currentSet?.[team]! >= matchType.gemDuration - 1 &&
      !tieBreak
    ) {
      if (setsLength === matchType.setDuration) {
        checkWinner();
      } else {
        addNewSet();
      }
      return;
    }

    if (type === 2) {
      console.log("sss");
      if (setsLength === matchType.setDuration) {
        console.log("sss");
        checkWinner();
      }
    }

    updateGemScore({
      id,
      team,
      gem: sets?.length! - 1,
      score: updatedTeam === undefined ? 0 : updatedTeam + 1,
      prevScore: sets?.[sets?.length! - 1],
    });
  }

  useEffect(() => {
    const sets = tournament?.score?.sets;
    const currentSet = sets?.[sets?.length - 1];
    const updatedTeam = currentSet?.[params!];
    const total = totalPlayedSets();

    if (type === 0 || type === 1) {
      checkTotalPlayingSets();
    }

    if (type === 0 && updatedTeam! >= matchType.gemDuration) {
      addNewSet();
    }

    checkForTieBreak();
  }, [isSuccessCurrentGemScore]);

  function handleUpdateCurrentTieBreakScore({
    team,
    action,
  }: {
    team: number;
    action: "plus" | "minus";
  }) {
    if (action === "plus") {
      updateTieScore({
        id,
        team,
        prevScore: tieBreakScore,
        score: tieBreakScore?.[team]! + 1,
      });
    }

    if (action === "minus" && tieBreakScore?.[team]! > 0) {
      updateTieScore({
        id,
        team,
        prevScore: tieBreakScore,
        score: tieBreakScore?.[team]! - 1,
      });
    }
  }

  useEffect(() => {
    const playerWonTieBreak =
      tieBreakScore?.[params!]! >= matchType.tieBreakDuration &&
      tieBreakScore?.reduce((a, b) => Math.abs(a - b), 0)! > 1;

    if (playerWonTieBreak) {
      resetTieBreakScore(params!);
      handleGemPoint(params!);
    }
  }, [isSuccessCurrentTieBreakScore]);

  useEffect(() => {
    if (tournament?.status?.status === "completed") setTieBreak(false);
  }, [isSuccessStatus]);

  // HELPERS
  /* TODO: Move helpers to the new file! */
  function checkMatchType() {
    const tieBreakDuration = tournament?.superTieBreak ? 10 : 7;

    if (type === 0) {
      setMatchType({
        setDuration: 3,
        gemDuration: 7,
        tieBreakDuration,
      });
    }

    if (type === 1) {
      setMatchType({
        setDuration: 3,
        gemDuration: 7,
        tieBreakDuration,
      });
    }

    if (type === 2) {
      setMatchType({
        setDuration: 1,
        gemDuration: 9,
        tieBreakDuration,
      });
    }
  }

  function checkForTieBreak(): boolean {
    if (type === 2) {
      currentSet?.every((n) => n === 8)
        ? setTieBreak(true)
        : setTieBreak(false);
    }

    if (type === 0) {
      currentSet?.every((n) => n === 6)
        ? setTieBreak(true)
        : setTieBreak(false);
    }

    return false;
  }

  function resetTieBreakScore(team: number) {
    updateTieScore({
      id,
      team,
      prevScore: [0, 0],
      score: 0,
    });
  }

  function checkTotalPlayingSets() {
    const total = totalPlayedSets();

    if (total?.player1 === 1 && total.player2 === 1) {
      setMatchType((prev) => ({
        ...prev,
        setDuration: 3,
      }));
    }
  }

  function addNewSet() {
    if (setsLength! >= matchType.setDuration) return;

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

  function totalPlayedSets() {
    let player1 = 0,
      player2 = 0,
      totalPlayedSets = 0;

    if (!tournament)
      return {
        player1: 0,
        player2: 0,
        total: 0,
      };

    for (const value of tournament?.score?.sets!) {
      const [p1, p2] = value;

      if (setsLength === matchType.setDuration || tieBreak) {
        if (p1 >= matchType.gemDuration || p2 >= matchType.gemDuration) {
          if (p1 > p2) {
            player1!++;
          } else {
            player2!++;
          }
        }
      }

      if (p1 >= matchType.gemDuration - 1 || p2 >= matchType.gemDuration - 1) {
        if (p1 > p2) {
          player1!++;
        } else {
          player2!++;
        }
      }

      totalPlayedSets++;
    }

    return {
      player1,
      player2,
      total: totalPlayedSets,
    };
  }

  function checkWinner() {
    const total = totalPlayedSets();

    if (type === 0) {
      if (total?.player1 >= 2) {
        // Winner of the match
        updateMatchWinner({
          gameId: id,
          winner: "host",
        });
        updateStatus({
          id,
          status: {
            status: "completed",
            id: 0,
          },
        });
      }

      if (total?.player2 >= 2) {
        // Winner of the match
        updateMatchWinner({
          gameId: id,
          winner: "guest",
        });
        updateStatus({
          id,
          status: {
            status: "completed",
            id: 0,
          },
        });
      }
    }

    if (type === 2 && currentSet?.[params!]! >= matchType.gemDuration - 1) {
      // Winner of the match
      updateMatchWinner({
        gameId: id,
        winner: params === 0 ? "host" : "guest",
      });
      updateStatus({
        id,
        status: {
          status: "completed",
          id: 0,
        },
      });
      return;
    }
  }
  // Firebase
  useEffect(() => {
    const tournamentsRef = ref(database, `tournaments/${id}`);

    const unsubscribe = onValue(tournamentsRef, (snapshot) => {
      const data: TournamentType = snapshot.val();

      if (!data) {
        setTournament(null);
        notFound();
      }

      checkMatchType();
      setTournament(data);
    });

    return () => {
      unsubscribe();
    };
  }, [id]);

  return { tournament, tieBreak, handleUpdateCurrentSetScore };
}
