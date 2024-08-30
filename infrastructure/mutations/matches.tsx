"use client";

import { useMutation } from "@tanstack/react-query";
import {
    addMatch,
    deleteMatch,
    updateCurrentSetScore,
    updateGemScore,
    updateMatchStatus,
    updateMatchWinner,
    updateServingPlayer,
    updateTieScore,
} from "../services/matches";
import { MatchTypeService } from "@/interfaces/matches";

export const useAddMatch = () => {
    return useMutation({
        // @ts-ignore
        mutationFn: (data: any) => addMatch(data),
    });
};

export const useDeleteMatch = () => {
    return useMutation({
        mutationFn: ({ id, tournament }: { id: string; tournament?: any }) =>
            deleteMatch(id, tournament),
    });
};

export const useUpdateCurrentSet = () => {
    return useMutation({
        mutationFn: ({ team, score, path, id, tournament }: any) =>
            updateCurrentSetScore({ team, id, score, path, tournament }),
    });
};

export const useUpdateGemScore = () => {
    return useMutation({
        mutationFn: ({ id, gem, team, score, prevScore, tournament }: any) =>
            updateGemScore({ id, gem, team, score, prevScore, tournament }),
    });
};

export const useUpdateTieScore = () => {
    return useMutation({
        mutationFn: ({ id, team, score, prevScore, tournament }: any) =>
            updateTieScore({ id, team, score, prevScore, tournament }),
    });
};

export const useUpdateMatchStatus = () => {
    return useMutation({
        mutationFn: ({
            id,
            status,
            tournament,
        }: {
            id: string;
            status: { status: string; id: number };
            tournament: any;
        }) => updateMatchStatus({ id, status, tournament }),
    });
};

export const useUpdateServingPlayer = () => {
    return useMutation({
        mutationFn: ({
            gameId,
            team,
            playerId,
            isServing,
            tournament,
        }: {
            gameId: string;
            team: string;
            playerId: string;
            isServing: boolean;
            tournament: any;
        }) => updateServingPlayer({ gameId, team, playerId, isServing, tournament }),
    });
};

export const useUpdateMatchWinner = () => {
    return useMutation({
        mutationFn: ({
            gameId,
            winner,
            tournament,
        }: {
            gameId: string;
            winner: string;
            tournament: any;
        }) => updateMatchWinner({ gameId, winner, tournament }),
    });
};
