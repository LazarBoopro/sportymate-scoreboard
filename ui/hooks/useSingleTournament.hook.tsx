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
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

export default function useSingleTournament({ id }: { id: string }) {
  //  Context
  const { tournament, setTournament } = useContext<{
    tournament: TournamentType;
    setTournament: CallableFunction;
  }>(Context);

  const router = useRouter();
  const { toast } = useToast();

  // States
  const [params, setParams] = useState<null | number>(null);
  const [matchType, setMatchType] = useState({
    setDuration: 2,
    gemDuration: 7,
    tieBreakDuration: 7,
  });
  const [isTieBreak, setIsTieBreak] = useState(false);

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

  // Constants
  const currentGem = tournament?.score?.currentSet;
  const setsLength = tournament?.score?.sets?.length;
  const currentSet = tournament?.score?.sets[setsLength! - 1];
  const type = +tournament?.type;
  const tieBreakScore = tournament?.score?.tiebreak;
  const playerWonGem =
    currentGem?.[params!]! > 3 &&
    currentGem?.reduce((a, b) => Math.abs(a - b), 0)! > 1;

  // Functions
  function handleUpdateCurrentSetScore({
    team,
    action,
  }: {
    team: number;
    action: "plus" | "minus";
  }) {
    setParams(team);

    if (isTieBreak) {
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
  }, [isSuccessCurrentMatchScore, tournament?.score?.currentSet]);

  // GEMS
  function handleGemPoint(team: number) {
    const sets = tournament?.score?.sets;
    const currentSet = sets?.[sets?.length - 1];
    const updatedTeam = currentSet?.[team];
    const t = totalPlayedSets();

    if (
      (type === 0 || type === 1) &&
      currentSet?.[team]! >= matchType.gemDuration - 1 &&
      !isTieBreak
    ) {
      if (t.total === 2 && (t.player1 === 2 || t.player2 === 2)) return;

      addNewSet();

      return;
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
    checkForTieBreak();
    checkTotalPlayingSets();
    checkWinner();
  }, [isSuccessCurrentGemScore, tournament?.score?.sets]);

  // TieBreaks...
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
  }, [isSuccessCurrentTieBreakScore, tournament?.score?.tiebreak]);

  useEffect(() => {
    if (tournament?.status?.status === "completed") {
      setIsTieBreak(false);
    } else {
      checkForTieBreak();
    }
  }, [isSuccessStatus, tournament?.status?.id]);

  useEffect(() => {
    checkMatchType();
  }, [tournament?.type]);

  // HELPERS
  function checkMatchType() {
    const tieBreakDuration = tournament?.superTieBreak ? 10 : 7;

    switch (type) {
      case 0:
      case 1:
        setMatchType({
          setDuration: 3,
          gemDuration: 7,
          tieBreakDuration,
        });
        break;

      case 2:
        setMatchType({
          setDuration: 1,
          gemDuration: 9,
          tieBreakDuration,
        });
        break;
    }
  }

  function checkForTieBreak() {
    switch (type) {
      case 0:
        currentSet?.every((n) => n === 6)
          ? setIsTieBreak(true)
          : setIsTieBreak(false);

        break;

      case 1:
        if (
          setsLength === matchType.setDuration ||
          currentSet?.every((n) => n === 6)
        ) {
          setIsTieBreak(true);
        } else {
          setIsTieBreak(false);
        }
        break;

      case 2:
        currentSet?.every((n) => n === 8)
          ? setIsTieBreak(true)
          : setIsTieBreak(false);

        break;
    }
  }

  function resetTieBreakScore(team: number) {
    if (type === 1) {
      checkWinner();
    }

    setIsTieBreak(false);
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

    tournament?.score?.sets.forEach((set) => {
      const [p1, p2] = set;

      if (p1 > p2) {
        player1++;
      }

      if (p2 > p1) {
        player2!++;
      }

      totalPlayedSets++;
    });

    return {
      player1,
      player2,
      total: totalPlayedSets,
    };
  }

  function checkWinner() {
    const total = totalPlayedSets();

    if (type === 0 || type === 1) {
      if (total?.player1 >= 2) {
        handleWinner("host");
      }

      if (total?.player2 >= 2) {
        handleWinner("guest");
      }
    }

    if (type === 2 && currentSet?.[params!]! >= matchType.gemDuration) {
      handleWinner(params === 0 ? "host" : "guest");
      return;
    }
  }

  function handleWinner(winner: "guest" | "host") {
    // Winner of the match
    updateMatchWinner({
      gameId: id,
      winner,
    });
    updateStatus({
      id,
      status: {
        status: "completed",
        id: 0,
      },
    });
  }

  // Firebase
  useEffect(() => {
    const tournamentsRef = ref(database, `tournaments/${id}`);

    const unsubscribe = onValue(tournamentsRef, (snapshot) => {
      const data: TournamentType = snapshot.val();

      if (!data) {
        setTournament(null);
        router.replace("/");
        toast({
          title: "Greška!",
          description: "Meč koji si gledao više ne postoji!",
          variant: "destructive",
        });
        notFound();
      }

      setTournament(data);
    });

    return () => {
      unsubscribe();
    };
  }, [id]);

  return { tournament, isTieBreak, handleUpdateCurrentSetScore };
}
