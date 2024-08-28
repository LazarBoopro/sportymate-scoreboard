import { useMutation } from "@tanstack/react-query";
import { addGroup, deleteGroup } from "../services/tournaments";

export const useAddGroup = () => {
    return useMutation({
        // @ts-ignore
        mutationFn: ({
            data,
            tournamentId,
            groupId,
            phase,
        }: {
            data: any;
            tournamentId: string;
            groupId: string;
            phase: "groups" | "round-of-16" | "quarter-finals" | "semi-final" | "final";
        }) => addGroup(data, tournamentId, groupId, phase),
    });
};

export const useDeleteGroup = (onSuccess: any) => {
    return useMutation({
        mutationFn: ({
            tournamentId,
            groupId,
            phase,
        }: {
            tournamentId: string;
            groupId: string;
            phase: "groups" | "round-of-16" | "quarter-finals" | "semi-final" | "final";
        }) => {
            return deleteGroup(tournamentId, groupId, phase);
        },
        onSuccess: (data, variables, context) => {
            console.log({ data, variables, context });
            onSuccess();
        },
    });
};
