"use client";

import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { getSingleMatch } from "../services/matches";
import { MatchType } from "@/interfaces/matches";
import { getGroups } from "../services/tournaments";

export const useGetSingleMatch = (
    id: string,
    tournament?: { tournamentId: string; groupId: string; phase: string }
): UseQueryResult<MatchType> => {
    return useQuery({
        queryKey: ["match", id],
        queryFn: () => getSingleMatch(id, tournament),
    });
};

export const useGetGroups = (
    tournamentId: string,
    phase: "groups" | "round-of-16" | "quarter-finals" | "semi-final" | "final"
): UseQueryResult<MatchType> => {
    return useQuery({
        queryKey: ["group", tournamentId, phase],
        queryFn: () => getGroups(tournamentId, phase),
    });
};
