import { useMutation } from "@tanstack/react-query";
import {
    addTeam,
    addTournament,
    deleteTeam,
    deleteTournament,
    updateTeam,
    updateTournament,
} from "../services/tournaments";

export const useAddTeam = () => {
    return useMutation({
        // @ts-ignore
        mutationFn: ({ tournamentId, data }: { tournamentId: string; data: any }) =>
            addTeam(tournamentId, data),
    });
};

export const useDeleteTeam = () => {
    return useMutation({
        mutationFn: ({ tournamentId, teamId }: { tournamentId: string; teamId: string }) =>
            deleteTeam(tournamentId, teamId),
    });
};

export const useUpdateTeam = () => {
    return useMutation({
        mutationFn: ({
            tournamentId,
            teamId,
            data,
        }: {
            tournamentId: string;
            teamId: string;
            data?: any;
        }) => updateTeam({ tournamentId, teamId, data }),
    });
};
