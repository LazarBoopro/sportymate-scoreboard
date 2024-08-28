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

export default function useSingleMatch({ id }: { id: string }) {
    //  Context
    const { tournament, setTournament } = useContext<{
        tournament: MatchType;
        setTournament: CallableFunction;
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
    const [total, setTotal] = useState({
        player1: 0,
        player2: 0,
        total: 0,
    });

    // Queries and Mutations
    const { mutate: updateMatchScore, isSuccess: isSuccessCurrentMatchScore } =
        useUpdateCurrentSet();
    const { mutate: updateGemScore, isSuccess: isSuccessCurrentGemScore } = useUpdateGemScore();
    const { mutate: updateTieScore, isSuccess: isSuccessCurrentTieBreakScore } =
        useUpdateTieScore();
    const { mutate: updateMatchWinner } = useUpdateMatchWinner();
    const { mutate: updateStatus, isSuccess: isSuccessStatus } = useUpdateMatchStatus();

    // Constants
    const currentGem = tournament?.score?.currentSet;
    const setsLength = tournament?.score?.sets?.length;
    const currentSet = tournament?.score?.sets[setsLength! - 1];
    const playerWonGem =
        currentGem?.[params!]! > 3 && currentGem?.reduce((a, b) => Math.abs(a - b), 0)! > 1;
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

    // GEMS
    function handleGemPoint(team: number) {
        const sets = tournament?.score?.sets;
        const updatedTeam = currentSet?.[team];

        if (
            (type === 0 || type === 1) &&
            currentSet?.[team]! >= matchType.gemDuration - 1 &&
            !tieBreak
        ) {
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

    // Helpers
    function updateScore({ arrayLength, score }: { arrayLength: number; score: number }) {
        Array.from({ length: arrayLength }).map((_, i) => {
            updateMatchScore({
                id,
                team: i,
                score,
            });
        });
    }

    function checkMatchType() {
        const tieBreakDuration = tournament?.superTieBreak ? 10 : 7;

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
        if (tournament?.winner) {
            setTieBreak(false);
            return;
        }

        if (type === 2) {
            currentSet?.every((n) => n === 8) ? setTieBreak(true) : setTieBreak(false);

            return;
        }

        if (type === 1) {
            currentSet?.every((n) => n === 6) || total.total >= 2
                ? setTieBreak(true)
                : setTieBreak(false);

            return;
        }

        if (type === 0) {
            currentSet?.every((n) => n === 6) ? setTieBreak(true) : setTieBreak(false);
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
        });
    }

    function addNewSet() {
        if (setsLength! >= matchType.setDuration) {
            return;
        }

        const team = params === 0 ? "player1" : "player2";

        setTotal((prev) => ({
            ...prev,
            [team]: prev?.[team] + 1,
            total: prev?.total + 1,
        }));

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

    function checkWinner() {
        if (type === 0 || type === 1) {
            if (total.total < 2) {
                return;
            }

            if (total?.player1 > total.player2) {
                handleWinner("host");
                return;
            }

            if (total?.player2 > total.player1) {
                handleWinner("guest");
                return;
            }
        }

        if (type === 2 && currentSet?.[params!]! >= matchType.gemDuration) {
            handleWinner(params === 0 ? "host" : "guest");
            return;
        }
    }

    function handleWinner(winner: "host" | "guest") {
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

    //useEffect

    useEffect(() => {
        if (playerWonGem) {
            updateScore({ arrayLength: 2, score: 0 });
            handleGemPoint(params!);

            return;
        }

        // Both at ADV position
        if (currentGem?.every((n) => n === 4)) {
            updateScore({ arrayLength: 2, score: 3 });
        }
    }, [isSuccessCurrentMatchScore, tournament?.score?.currentSet]);

    useEffect(() => {
        checkWinner();
        checkForTieBreak();
    }, [isSuccessCurrentGemScore, tournament?.score?.sets]);

    useEffect(() => {
        const playerWonTieBreak =
            tieBreakScore?.[params!]! >= matchType.tieBreakDuration &&
            tieBreakScore?.reduce((a, b) => Math.abs(a - b), 0)! > 1;

        if (playerWonTieBreak) {
            resetTieBreakScore(params!);
            handleGemPoint(params!);
            checkWinner();
            addNewSet();
        }
    }, [isSuccessCurrentTieBreakScore, tournament?.score?.tiebreak]);

    useEffect(() => {
        if (tournament?.winner || tournament?.status?.status === "completed") {
            setTieBreak(false);
        }
    }, [tournament?.winner, tournament?.status?.status]);

    useEffect(() => {
        checkMatchType();
        checkForTieBreak();
    }, [tournament?.type]);

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
    }, [tournament?.score?.sets]);

    useEffect(() => {
        checkForTieBreak();
    }, [total]);

    // Check total played sets on mount
    useEffect(() => {
        let index = 0;

        const sets = tournament?.score?.sets;

        if (!sets) return;

        for (const [p1, p2] of sets!) {
            let dur = sets?.[index].every((n) => n >= 6) ? 7 : 6;

            if (p1 >= dur && p1 > p2) {
                setTotal((prev) => ({
                    ...prev,
                    player1: prev.player1 + 1,
                }));
            }

            if (p2 >= dur && p2 > p1) {
                setTotal((prev) => ({
                    ...prev,
                    player2: prev.player2 + 1,
                }));
            }

            setTotal((prev) => ({
                ...prev,
                total: prev.player1 + prev.player2,
            }));
            index++;
        }
    }, [tournament?.type]);

    // Firebase
    useEffect(() => {
        const tournamentsRef = ref(database, `tournaments/${id}`);

        const unsubscribe = onValue(tournamentsRef, (snapshot) => {
            const data: MatchType = snapshot.val();

            if (!data) {
                setTournament(null);
                router.replace("/");
                toast({
                    title: "Greška!",
                    description: `Meč ${id} ne postoji!`,
                    variant: "destructive",
                });
                notFound();
            }

            setTournament(data);
        });

        return () => {
            unsubscribe();
            setTournament(null);
            setTotal({
                player1: 0,
                player2: 0,
                total: 0,
            });
        };
    }, [id]);

    return { tournament, tieBreak, handleUpdateCurrentSetScore };
}
