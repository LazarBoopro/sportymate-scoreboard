"use client";

import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { getSingleTournament } from "../services/matches";
import { MatchType } from "@/interfaces/tournaments";

export const useGetSingleTournament = (
  id: string
): UseQueryResult<MatchType> => {
  return useQuery({
    queryKey: ["tournament", id],
    queryFn: () => getSingleTournament(id),
  });
};
