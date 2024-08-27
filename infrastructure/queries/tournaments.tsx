"use client";

import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { getSingleTournament } from "../services/matches";
import { TournamentType } from "@/interfaces/tournaments";

export const useGetSingleTournament = (
  id: string
): UseQueryResult<TournamentType> => {
  return useQuery({
    queryKey: ["tournament", id],
    queryFn: () => getSingleTournament(id),
  });
};
