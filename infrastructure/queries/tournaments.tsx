"use client";

import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { getSingleMatch } from "../services/matches";
import { TournamentType } from "@/interfaces/tournaments";

export const useGetSingleTournament = (id: string): UseQueryResult<TournamentType> => {
    return useQuery({
        queryKey: ["tournament", id],
        queryFn: () => getSingleMatch(id),
    });
};
