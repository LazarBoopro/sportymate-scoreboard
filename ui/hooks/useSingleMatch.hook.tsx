"use client";

import { useContext, useEffect, useState } from "react";
import { notFound, useRouter } from "next/navigation";

import Context from "@/ui/providers/NavbarContext.provider";

import {
  useUpdateCurrentSet,
  useUpdateGemScore,
  useUpdateMatchStatus,
  useUpdateMatchWinner,
  useUpdateTieScore,
} from "@/infrastructure/mutations/matches";

import { database } from "@/lib/firebaseConfig";
import { onValue, ref } from "firebase/database";

import { MatchType } from "@/interfaces/matches";
import { useToast } from "@/components/ui/use-toast";

let isWinner = false;

export default function useSingleMatch({
  id,
  tournament,
}: {
  id: string;
  tournament?: {
    tournamentId: string;
    groupId: string;
    phase: string;
  };
}) {
  //  Context
  const { match, setMatch } = useContext<{
    match: MatchType;
    setMatch: CallableFunction;
  }>(Context);

  const { toast } = useToast();
  const router = useRouter();

  // States
  const [params, setParams] = useState<null | number>(null);
  const [matchType, setMatchType] = useState({
    setDuration: 3,
    gemDuration: 7,
    tieBreakDuration: 7,
  });
  const [tieBreak, setTieBreak] = useState(false);
  // ovo total nema potrebe da bude state jer ne renderujemo nista u zavisnosti od njega, bitan nam je samo a racun
  const [total, setTotal] = useState({
    player1: 0,
    player2: 0,
    total: 0,
  });

  // ne znam jel ce da radi sve kako treba
  // let total = {
  //   player1: 0,
  //   player2: 0,
  //   total: 0,
  // };

  const [selectedSet, setSelectedSet] = useState(
    (match?.score?.sets?.length ?? 1) - 1
  );

  // Constants
  const currentGem = match?.score?.currentSet;
  const setsLength = match?.score?.sets?.length;
  const currentSet = match?.score?.sets[setsLength! - 1];

  const playerWonGem =
    currentGem?.[params!]! > 3 &&
    currentGem?.reduce((a, b) => Math.abs(a - b), 0)! > 1;
  const type = +match?.type;
  const tieBreakScore = match?.score?.tiebreak;
  const isGoldenPoint = match?.goldenPoint;

  // Queries and Mutations
  const { mutate: updateMatchScore, isSuccess: isSuccessCurrentMatchScore } =
    useUpdateCurrentSet();
  const { mutate: updateGemScore, isSuccess: isSuccessCurrentGemScore } =
    useUpdateGemScore();
  const { mutate: updateTieScore, isSuccess: isSuccessCurrentTieBreakScore } =
    useUpdateTieScore();
  const { mutate: updateMatchWinner } = useUpdateMatchWinner();
  const { mutate: updateStatus } = useUpdateMatchStatus();

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
        team: team.toString(),
        score: match?.score?.currentSet[team]! - 1,
        tournament,
      });

      return;
    }

    if (action === "plus" && currentGem?.[team]! <= 4) {
      updateMatchScore({
        id,
        team: team.toString(),
        score: match?.score?.currentSet[team]! + 1,
        tournament,
      });

      return;
    }
  }

  // GEMS
  function handleGemPoint(team: number, action?: "plus" | "minus") {
    setParams(team);

    const sets = match?.score?.sets;
    const updatedTeam = currentSet?.[team];

    if (tieBreak && action) {
      return;
    }

    if (!action) action = "plus";

    if (selectedSet != sets?.length! - 1 || match?.winner) {
      const oldResult = sets?.[selectedSet]?.[team];

      let newScore = action == "plus" ? oldResult! + 1 : oldResult! - 1;

      if (newScore < 0) return;
      if (newScore > matchType.gemDuration) return;

      updateGemScore({
        id,
        team: team.toString(),
        gem: selectedSet,
        score: newScore,
        prevScore: sets?.[selectedSet],
        tournament,
      });

      return;
    }

    if (
      (type === 0 || type === 1) &&
      currentSet?.[team]! >= matchType.gemDuration - 1 &&
      !tieBreak
    ) {
      // igra se na 2 razlike ako je 1 razlika onda moramo update gem score
      if (
        currentSet?.[team]! == matchType.gemDuration - 1 &&
        Math.abs(currentSet?.[0]! - currentSet?.[1]!) === 1
      ) {
        updateGemScore({
          id,
          team: team.toString(),
          gem: sets?.length! - 1,
          score: updatedTeam === undefined ? 0 : updatedTeam + 1,
          prevScore: sets?.[sets?.length! - 1],
          tournament,
        });
      }

      addNewSet();
      return;
    }

    updateGemScore({
      id,
      team: team.toString(),
      gem: sets?.length! - 1,
      score:
        updatedTeam === undefined
          ? 0
          : action === "plus"
          ? updatedTeam + 1
          : updatedTeam - 1 >= 0
          ? updatedTeam - 1
          : 0,
      prevScore: sets?.[sets?.length! - 1],
      tournament,
    });
  }

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
        prevScore: tieBreakScore ?? [],
        score: tieBreakScore?.[team]! + 1,
        tournament,
      });
    }

    if (action === "minus" && tieBreakScore?.[team]! > 0) {
      updateTieScore({
        id,
        team,
        prevScore: tieBreakScore ?? [],
        score: tieBreakScore?.[team]! - 1,
        tournament,
      });
    }
  }

  // Helpers
  function updateScore({
    arrayLength,
    score,
  }: {
    arrayLength: number;
    score: number;
  }) {
    Array.from({ length: arrayLength }).map((_, i) => {
      updateMatchScore({
        id,
        team: i.toString(),
        score,
        tournament,
      });
    });
  }

  function checkMatchType() {
    const tieBreakDuration = match?.superTieBreak ? 10 : 7;

    if (type === 0 || type === 1) {
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

  function checkForTieBreak() {
    if (match?.winner) {
      setTieBreak(false);
      return;
    }

    if (type === 2) {
      currentSet?.every((n) => n === 8)
        ? setTieBreak(true)
        : setTieBreak(false);

      return;
    }

    if (type === 1) {
      currentSet?.every((n) => n === 6) || total.total >= 2
        ? setTieBreak(true)
        : setTieBreak(false);

      return;
    }

    if (type === 0) {
      currentSet?.every((n) => n === 6)
        ? setTieBreak(true)
        : setTieBreak(false);
      return;
    }

    setTieBreak(false);
  }

  function resetTieBreakScore(team: number) {
    setTieBreak(false);
    updateTieScore({
      id,
      team,
      prevScore: [0, 0],
      score: 0,
      tournament,
    });
  }

  function addNewSet() {
    if (setsLength! >= matchType.setDuration) {
      return;
    }
    if (match.winner) return;

    const team = params === 0 ? "player1" : "player2";

    const newTotal = {
      ...total,
      [team]: total?.[team] + 1,
      total: total?.total + 1,
    };
    setTotal(newTotal);
    // total = newTotal;

    setSelectedSet(setsLength ?? 0);

    if (newTotal.total >= 2) {
      if (type === 0 || type === 1) {
        if (newTotal?.player1 > newTotal.player2) {
          handleWinner("host");
          return;
        }

        if (newTotal?.player2 > newTotal.player1) {
          handleWinner("guest");
          return;
        }
      }

      if (type === 2 && currentSet?.[params!]! >= matchType.gemDuration) {
        handleWinner(params === 0 ? "host" : "guest");
        return;
      }
    }

    Array.from({ length: 2 }).forEach((_, i) =>
      updateGemScore({
        id,
        team: i.toString(),
        gem: setsLength ?? 0,
        score: 0,
        prevScore: [0, 0],
        tournament,
      })
    );
  }

  function checkWinner(winner: "host" | "guest", finishMatch: boolean) {
    // TODO: nesto ne radi kako treba ???
    // if (type === 0 || type === 1) {
    //   if (total.total < 2) {
    //     return false;
    //   }
    //   if (total?.player1 > total.player2) {
    //     handleWinner("host");
    //     return true;
    //   }
    //   if (total?.player2 > total.player1) {
    //     handleWinner("guest");
    //     return true;
    //   }
    // }
    // if (type === 2 && currentSet?.[params!]! >= matchType.gemDuration) {
    //   handleWinner(params === 0 ? "host" : "guest");
    //   return true;
    // }
    // return false;
  }

  function handleSetWinner(
    winner: "host" | "guest" | null,
    finishMatch: boolean
  ) {
    updateMatchWinner({
      gameId: id,
      winner,
      tournament,
    });

    if (finishMatch) {
      updateStatus({
        id,
        status: {
          status: "completed",
          id: 0,
        },
        tournament,
      });
    }
  }

  function handleWinner(winner: "host" | "guest") {
    updateMatchWinner({
      gameId: id,
      winner,
      tournament,
    });
    updateStatus({
      id,
      status: {
        status: "completed",
        id: 0,
      },
      tournament,
    });

    // alert("WINNER : " + winner);
    //TODO: UPDATE GROUP TEAM WIN AND LOSS COUNT
  }

  //useEffect

  useEffect(() => {
    if (playerWonGem || (isGoldenPoint && currentGem?.[params!]! > 3)) {
      updateScore({ arrayLength: 2, score: 0 });
      handleGemPoint(params!);

      return;
    }

    // Both at ADV position
    if (currentGem?.every((n) => n === 4)) {
      updateScore({ arrayLength: 2, score: 3 });
    }
  }, [isSuccessCurrentMatchScore, match?.score?.currentSet]);

  useEffect(() => {
    // checkWinner();
    checkForTieBreak();
  }, [isSuccessCurrentGemScore, match?.score?.sets]);

  useEffect(() => {
    const playerWonTieBreak =
      tieBreakScore?.[params!]! >= matchType.tieBreakDuration &&
      tieBreakScore?.reduce((a, b) => Math.abs(a - b), 0)! > 1;

    if (playerWonTieBreak) {
      resetTieBreakScore(params!);
      handleGemPoint(params!);
      // checkWinner();
      addNewSet();
    }
  }, [isSuccessCurrentTieBreakScore, match?.score?.tiebreak]);

  useEffect(() => {
    if (match?.winner || match?.status?.status === "completed") {
      setTieBreak(false);
    }
  }, [match?.winner, match?.status?.status]);

  useEffect(() => {
    checkMatchType();
    checkForTieBreak();
  }, [match?.type]);

  useEffect(() => {
    const { player1, player2 } = total;

    if (type === 0 || type === 1) {
      if (player1 === 1 && player2 === 1) {
        setMatchType((prev) => ({
          ...prev,
          setDuration: 4,
        }));
      }
    }
  }, [match?.score?.sets]);

  useEffect(() => {
    checkForTieBreak();
  }, [total]);

  // Check total played sets on mount
  useEffect(() => {
    let index = 0;

    const sets = match?.score?.sets;

    if (!sets) return;

    for (const [p1, p2] of sets!) {
      let dur = sets?.[index].every((n) => n >= 6) ? 7 : 6;

      if (p1 >= dur && p1 > p2) {
        setTotal((prev) => ({
          ...prev,
          player1: prev.player1 + 1,
        }));

        // total.player1++;
      }

      if (p2 >= dur && p2 > p1) {
        setTotal((prev) => ({
          ...prev,
          player2: prev.player2 + 1,
        }));

        // total.player2++;
      }

      setTotal((prev) => ({
        ...prev,
        total: prev.player1 + prev.player2,
      }));

      // total.total = total.player1 + total.player2;

      index++;
    }
  }, [match?.type]);

  // Firebase
  useEffect(() => {
    let prefix = "";
    if (tournament) {
      prefix = `tournaments/${tournament.tournamentId}/matches/${tournament.phase}/${tournament.groupId}/`;
    }

    const matchsRef = ref(database, `${prefix}matches/${id}`);

    const unsubscribe = onValue(matchsRef, (snapshot) => {
      const data: MatchType = snapshot.val();

      if (!data) {
        setMatch(null);
        router.replace("/");
        toast({
          title: "Greška!",
          description: `Meč ${id} ne postoji!`,
          variant: "destructive",
        });
        notFound();
      }

      setMatch(data);
    });

    return () => {
      unsubscribe();
      setMatch(null);
      setTotal({
        player1: 0,
        player2: 0,
        total: 0,
      });
      // total = {
      //   player1: 0,
      //   player2: 0,
      //   total: 0,
      // };
    };
  }, [id]);

  return {
    match,
    tieBreak,
    handleUpdateCurrentSetScore,
    handleGemPoint,
    setSelectedSet,
    handleSetWinner,
    selectedSet,
  };
}
