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
  updateSets,
  updateTieScore,
} from "../services/matches";
import { TournamentQueryParams } from "@/interfaces/tournaments";
import { MatchScoreType } from "@/interfaces/matches";

export const useAddMatch = () => {
  return useMutation({
    // @ts-ignore
    mutationFn: (data: MatchType) => addMatch(data),
  });
};

export const useDeleteMatch = () => {
  return useMutation({
    mutationFn: ({
      id,
      tournament,
    }: {
      id: string;
      tournament?: TournamentQueryParams;
    }) => deleteMatch(id, tournament),
  });
};

export const useUpdateCurrentSet = () => {
  return useMutation({
    mutationFn: ({
      team,
      score,
      id,
      tournament,
    }: {
      id: string;
      team: string;
      score: number;
      tournament?: TournamentQueryParams;
    }) => updateCurrentSetScore({ team, id, score, tournament }),
  });
};

export const useUpdateGemScore = () => {
  return useMutation({
    mutationFn: ({
      id,
      gem,
      team,
      score,
      prevScore,
      tournament,
    }: {
      id: string;
      gem: number;
      team: string;
      score: number;
      prevScore?: number[];
      tournament?: TournamentQueryParams;
    }) => updateGemScore({ id, gem, team, score, prevScore, tournament }),
  });
};

export const useUpdateTieScore = () => {
  return useMutation({
    mutationFn: ({
      id,
      team,
      score,
      prevScore,
      tournament,
    }: {
      id: string;
      prevScore: number[];
      team: number;
      score: number;
      tournament?: TournamentQueryParams;
    }) => updateTieScore({ id, team, score, prevScore, tournament }),
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
      tournament?: TournamentQueryParams;
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
      tournament?: TournamentQueryParams;
    }) =>
      updateServingPlayer({ gameId, team, playerId, isServing, tournament }),
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
      winner: string | null;
      tournament?: TournamentQueryParams;
    }) => updateMatchWinner({ gameId, winner, tournament }),
  });
};

export const useUpdateSets = () => {
  return useMutation({
    mutationFn: ({
      id,
      sets,
      tournament,
    }: {
      id: string;
      sets: number[][];
      tournament?: TournamentQueryParams;
    }) => updateSets({ id, sets, tournament }),
  });
};
