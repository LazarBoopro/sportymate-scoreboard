"use client";

import { useMutation } from "@tanstack/react-query";
import {
  addTournament,
  deleteTournament,
  updateCurrentSetScore,
  updateGemScore,
  updateMatchStatus,
  updateMatchWinner,
  updateServingPlayer,
  updateTieScore,
  updateTournament,
} from "../services/touirnaments";
import { TournamentTypeService } from "@/interfaces/tournaments";

export const useAddTournament = () => {
  return useMutation({
    // @ts-ignore
    mutationFn: (data: TournamentTypeService) => addTournament(data),
  });
};

export const useDeleteTournament = () => {
  return useMutation({
    mutationFn: (id: string) => deleteTournament(id),
  });
};

export const useUpdateTournament = () => {
  return useMutation({
    mutationFn: ({
      id,
      data,
      path,
      team,
    }: {
      team: string;
      id: string;
      data: any;
      path: string;
    }) => updateTournament({ team, id, data, path }),
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
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: { status: string; id: number };
    }) => updateMatchStatus({ id, status }),
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

// export const useUpdateMatchWinner = () => {
//   return useMutation({
//     mutationFn: ({ gameId, winner }: { gameId: string; winner: string }) => (
//       console.log(gameId, winner), updateMatchWinner({ gameId, winner })
//     ),
//   });
// };
