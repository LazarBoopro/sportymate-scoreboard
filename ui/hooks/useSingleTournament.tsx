"use client";

import { useContext, useEffect, useState } from "react";

import { database } from "@/lib/firebaseConfig";
import { onValue, ref } from "firebase/database";

import {
  useUpdateCurrentSet,
  useUpdateGemScore,
  useUpdateTieScore,
} from "@/infrastructure/mutations/tournaments";
import { scores } from "@/lib/helpers/score";
import Context from "@/ui/providers/NavbarContext.provider";
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

/* 
  NOTICE: 
  In Handlers, we update local state (useState),
  then on that state change we call an service
  to firebase to actually update data
*/

export default function useSingleTournament({ id }: { id: string }) {
  const { tournament, setTournament } = useContext<{
    tournament: TournamentType;
    setTournament: CallableFunction;
  }>(Context);

  const [score, setScore] = useState(tournament?.score?.currentSet || [0, 0]);
  const [gemScore, setGemScore] = useState(
    tournament?.score?.tiebreak || [0, 0]
  );
  const [params, setParams] = useState<ParamsType | null>(null);
  const [currentSet, setCurrentSet] = useState([0, 0]);
  const [tie, setIsTie] = useState(false);
  const [bothAt6, setBothAt6] = useState(false);

  const { mutate: updateMatchScore } = useUpdateCurrentSet();
  const { mutate: updateGemScore } = useUpdateGemScore();
  const { mutate: updateTieScore } = useUpdateTieScore();

  const handleUpdateCurrentSetScore = ({
    path,
    team,
    action,
  }: HandleUpdateType) => {
    setParams({ team, path, action });
    if (tie) {
      if (action === "minus") {
        setGemScore((prev) => ({
          ...prev,
          [team]: prev[team] - 1,
        }));
      } else if (action === "plus") {
        setGemScore((prev) => ({
          ...prev,
          [team]: prev[team] + 1,
        }));
      }

      return;
    }

    if (action === "minus" && score?.[team] !== 0) {
      setScore((prev) => prev?.map((n, i) => (i === team ? n - 1 : n)));
    } else if (action === "plus" && score?.[team]! < scores.length - 1) {
      setScore((prev) => prev?.map((n, i) => (i === team ? n + 1 : n)));
    }
  };

  const handleTiePoints = ({ team }: { team: number }) => {
    const score = tournament?.score?.tiebreak;
    const sets = tournament?.score?.sets;
    const isScoreUndefined = typeof score === "undefined";
    const playerWonSet =
      gemScore?.reduce?.((a, b) => Math.abs(a - b)) > 1 && gemScore?.[team] > 6;

    const gemTeam = sets?.[sets?.length - 1][team];

    if (playerWonSet) {
      updateTieScore({
        id,
        team,
        prevScore: [0, 0],
        score: 0,
      });

      Array.from({ length: 2 }).forEach((_, i) =>
        updateGemScore({
          id,
          team: i,
          gem: sets?.length,
          score: 0,
          prevScore: [0, 0],
        })
      );

      // Update gem in current set
      updateGemScore({
        id,
        team,
        gem: sets?.length! - 1,
        score: gemTeam === undefined ? 0 : gemTeam + 1,
        prevScore: tournament?.score?.sets[sets?.length! - 1],
      });

      return;
    }

    if (isNaN(team)) return;

    updateTieScore({
      id,
      team,
      prevScore: isScoreUndefined ? [0, 0] : score,
      score: isScoreUndefined ? 1 : gemScore[team],
    });
  };

  // Update gem in active set
  const handleGemPoints = ({ team }: { team: number }) => {
    const sets = tournament?.score?.sets;
    const currSet = tournament?.score?.sets[sets?.length! - 1];
    const currPoint = currSet?.[team];
    const gemTeam = sets?.[sets?.length - 1][team];

    if (currPoint! >= 6 && !bothAt6) {
      // Add new set, check for tie
      Array.from({ length: 2 }).forEach((_, i) =>
        updateGemScore({
          id,
          team: i,
          gem: sets?.length,
          score: 0,
          prevScore: [0, 0],
        })
      );

      return;
    }

    // Update gem in current set
    updateGemScore({
      id,
      team,
      gem: sets?.length! - 1,
      score: gemTeam === undefined ? 0 : gemTeam + 1,
      prevScore: tournament?.score?.sets[sets?.length! - 1],
    });
  };

  // UseEffect for gems (Tie break)
  useEffect(() => {
    const team = Number(params?.team);

    handleTiePoints({ team });
  }, [gemScore]);

  // UseEffect for sets
  useEffect(() => {
    const team = Number(params?.team);
    const bothAdv = score?.every((n) => n === scores?.length - 2)
      ? true
      : false;

    const playerWonGem =
      score?.[team] > 3 && score?.reduce?.((a, b) => Math.abs(a - b)) > 1;

    setIsTie(
      tournament?.score?.sets[tournament.score?.sets.length - 1].every(
        (n: number) => n === 6
      ) ?? false
    );
    setBothAt6(currentSet?.every((n: number) => n >= 6));
    setGemScore(tournament?.score?.tiebreak!);

    if (bothAdv) {
      score?.forEach((_, i) => {
        updateMatchScore({
          id,
          team: i,
          score: 3,
        });
      });
      return;
    }

    if (playerWonGem) {
      score?.forEach((_, i) => {
        updateMatchScore({
          id,
          team: i,
          score: 0,
        });
      });
      handleGemPoints({ team });

      return;
    }

    updateMatchScore({
      id,
      team,
      score: score?.[team],
    });
  }, [score]);

  useEffect(() => {
    const tournamentsRef = ref(database, `tournaments/${id}`);

    const unsubscribe = onValue(tournamentsRef, (snapshot) => {
      const data: TournamentType = snapshot.val();

      if (data) {
        setScore(data?.score?.currentSet || [0, 0]);

        setCurrentSet(data.score?.sets[data.score?.sets.length - 1] ?? [0, 0]);
        setTournament(data);
      } else {
        setTournament(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return { tie, tournament, handleUpdateCurrentSetScore };
}
