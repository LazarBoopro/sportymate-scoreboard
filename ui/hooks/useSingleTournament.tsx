"use client";

import { useEffect, useState } from "react";

import { database } from "@/lib/firebaseConfig";
import { onValue, ref } from "firebase/database";

import { TournamentType } from "@/interfaces/tournaments";

import {
  useUpdateCurrentSet,
  useUpdateGemScore,
} from "@/infrastructure/mutations/tournaments";
import { scores } from "../components/atoms/Score.atom";

export default function useSingleTournament({ id }: { id: string }) {
  const [tournament, setTournament] = useState<TournamentType | null>(null);
  const [score, setScore] = useState(tournament?.score.currentSet || [0, 0]);
  const [params, setParams] = useState<{
    team: number;
    path: string;
    action: "plus" | "minus";
    advIndex?: number;
  } | null>(null);

  const { mutate: updateMatchScore } = useUpdateCurrentSet();
  const { mutate: updateGemScore } = useUpdateGemScore();

  const handleUpdateCurrentSetScore = ({
    path,
    team,
    action,
  }: {
    team: number;
    path: string;
    action: "plus" | "minus";
  }) => {
    setParams({ team, path, action });
    if (action === "minus" && score?.[team] !== 0) {
      setScore((prev) => prev?.map((n, i) => (i === team ? n - 1 : n)));
    } else if (action === "plus" && score?.[team]! < scores.length - 1) {
      setScore((prev) => prev?.map((n, i) => (i === team ? n + 1 : n)));
    }
  };

  const handleGemPoints = ({ team }: { team: number }) => {
    const sets = tournament?.score.sets;
    const currSet = tournament?.score.sets[sets?.length! - 1];
    const currPoint = currSet?.[team];
    const gemTeam = sets?.[sets?.length - 1][team];

    // Add new set
    if (currPoint! >= 5) {
      console.log("ssss");
      Array.from({ length: 2 }).forEach((_, i) =>
        updateGemScore({
          id,
          team: i,
          gem: sets?.length,
          score: 0,
          prevScore: [0, 0],
        })
      );
    }

    // Update gem in current set
    updateGemScore({
      id,
      team,
      gem: sets?.length! - 1,
      score: gemTeam === undefined ? 0 : gemTeam + 1,
      prevScore: tournament?.score.sets[sets?.length! - 1],
    });
  };

  useEffect(() => {
    const team = Number(params?.team);
    const path = params?.path;
    const bothAdv = score?.every((n) => n === scores.length - 2) ? true : false;

    const playerWonGem =
      score?.[team] > 3 && score?.reduce((a, b) => Math.abs(a - b)) > 1;

    if (bothAdv) {
      score?.forEach((_, i) => {
        updateMatchScore({
          id,
          team: i,
          score: 3,
          path,
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
          path,
        });
      });
      handleGemPoints({ team });

      return;
    }

    updateMatchScore({
      id,
      team,
      score: score?.[team],
      path,
    });
  }, [score]);

  useEffect(() => {
    const tournamentsRef = ref(database, `tournaments/${id}`);

    const unsubscribe = onValue(tournamentsRef, (snapshot) => {
      const data: TournamentType = snapshot.val();

      if (data) {
        setScore(data.score.currentSet);
        setTournament(data);
      } else {
        setTournament(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return { tournament, handleUpdateCurrentSetScore };
}
