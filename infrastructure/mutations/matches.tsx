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
        mutationFn: (id: string) => deleteMatch(id),
    });
};

export const useUpdateCurrentSet = () => {
    return useMutation({
        mutationFn: ({ team, score, path, id }: any) =>
            updateCurrentSetScore({ team, id, score, path }),
    });
};

export const useUpdateGemScore = () => {
    return useMutation({
        mutationFn: ({ id, gem, team, score, prevScore }: any) =>
            updateGemScore({ id, gem, team, score, prevScore }),
    });
};

export const useUpdateTieScore = () => {
    return useMutation({
        mutationFn: ({ id, team, score, prevScore }: any) =>
            updateTieScore({ id, team, score, prevScore }),
    });
};

export const useUpdateMatchStatus = () => {
    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: { status: string; id: number } }) =>
            updateMatchStatus({ id, status }),
    });
};

export const useUpdateServingPlayer = () => {
    return useMutation({
        mutationFn: ({
            gameId,
            team,
            playerId,
            isServing,
        }: {
            gameId: string;
            team: string;
            playerId: string;
            isServing: boolean;
        }) => updateServingPlayer({ gameId, team, playerId, isServing }),
    });
};

export const useUpdateMatchWinner = () => {
    return useMutation({
        mutationFn: ({ gameId, winner }: { gameId: string; winner: string }) =>
            updateMatchWinner({ gameId, winner }),
    });
};
