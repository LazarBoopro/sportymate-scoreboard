"use client";

import { useMutation } from "@tanstack/react-query";
import {
  addTournament,
  deleteTournament,
  updateCurrentSetScore,
  updateGemScore,
  updateMatchStatus,
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
    mutationFn: ({ id, path, gem, team, score, prevScore }: any) =>
      updateGemScore({ id, path, gem, team, score, prevScore }),
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
