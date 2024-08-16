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
import { notFound } from "next/navigation";
import { MATCH_TYPES } from "@/lib/constants/match";

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
  const [tieBreakScore, setTieBreakScore] = useState(
    tournament?.score?.tiebreak || [0, 0]
  );
  const [limitGemPoint, setLimitGemPoint] = useState(
    Number(tournament?.type) === 2 ? 8 : 6
  );
  const [isSuperTieBreak, setIsSuperTieBreak] = useState(
    tournament?.superTieBreak
  );
  const [playingSets, setPlayingSets] = useState(
    MATCH_TYPES[Number(tournament?.type)]?.noOfSets
  );
  const [winner, setWinner] = useState<any>(null);

  const [params, setParams] = useState<ParamsType | null>(null);
  const [currentSet, setCurrentSet] = useState([0, 0]);
  const [tie, setIsTie] = useState(false);
  const [bothAt6, setBothAt6] = useState(false);

  const { mutate: updateMatchScore } = useUpdateCurrentSet();
  const { mutate: updateGemScore } = useUpdateGemScore();
  const { mutate: updateTieScore } = useUpdateTieScore();

  const checkWinner = () => {
    const winnedSetsTeam1 = tournament?.score?.sets.reduce(
      (a, b) => (b[0] > b[1] ? a + 1 : a + 0),
      0
    );
    const winnedSetsTeam2 = tournament?.score?.sets.reduce(
      (a, b) => (b[1] > b[0] ? a + 1 : a + 0),
      0
    );

    if (winnedSetsTeam1! > winnedSetsTeam2!) {
      setWinner(0);
    }
    if (winnedSetsTeam1! < winnedSetsTeam2!) {
      setWinner(1);
    }
  };

  const handleUpdateCurrentSetScore = ({
    path,
    team,
    action,
  }: HandleUpdateType) => {
    setParams({ team, path, action });
    if (tie) {
      if (action === "minus") {
        setTieBreakScore((prev) => ({
          ...prev,
          [team]: prev[team] - 1,
        }));
      }

      if (action === "plus") {
        setTieBreakScore((prev) => ({
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
    const sets = tournament?.score?.sets;
    const isScoreUndefined = typeof score === "undefined";
    const playerWonSet =
      tieBreakScore?.reduce?.((a, b) => Math.abs(a - b)) > 1 &&
      tieBreakScore?.[team] > (isSuperTieBreak ? 9 : 6);

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
      prevScore: tieBreakScore,
      score: isScoreUndefined ? 1 : tieBreakScore[team],
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
  }, [tieBreakScore]);

  // UseEffect for sets
  useEffect(() => {
    const team = Number(params?.team);
    const bothAdv = score?.every((n) => n === scores?.length - 2)
      ? true
      : false;

    const playerWonGem =
      score?.[team] > 3 && score?.reduce?.((a, b) => Math.abs(a - b)) > 1;

    // console.log(tournament?.score?.sets.length! > playingSets, "SSSS");
    setIsTie(
      tournament?.score?.sets[tournament.score?.sets.length - 1].every(
        (n: number) => n === limitGemPoint
      ) ?? false
    );
    setBothAt6(currentSet?.every((n: number) => n >= limitGemPoint));
    setTieBreakScore(tournament?.score?.tiebreak!);

    if (tournament?.score?.sets.length! > playingSets) {
      checkWinner();
      return;
    }

    // SET BOTH PLAYERS SCORE TO 40:40
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

  // --------------
  useEffect(() => {
    setPlayingSets(MATCH_TYPES[Number(tournament?.type)]?.noOfSets);
    setLimitGemPoint(Number(tournament?.type) === 2 ? 8 : 6);
    setIsSuperTieBreak(tournament?.superTieBreak);
  }, [tournament]);

  useEffect(() => {
    checkWinner();
  }, [tournament?.score]);

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
        notFound();
      }
    });

    return () => unsubscribe();
  }, []);

  return { tie, tournament, winner, handleUpdateCurrentSetScore };
}
