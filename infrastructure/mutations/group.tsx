import { useMutation } from "@tanstack/react-query";
import { addGroup, deleteGroup, updateGroupPoints } from "../services/tournaments";
import { GroupPhaseEnum } from "@/interfaces/tournaments";

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
            phase: GroupPhaseEnum;
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
            phase: GroupPhaseEnum;
        }) => {
            return deleteGroup(tournamentId, groupId, phase);
        },
        onSuccess: (data, variables, context) => {
            onSuccess();
        },
    });
};

export const useUpdateGroup = () => {
    return useMutation({
        mutationFn: ({
            tournamentId,
            groupId,
            phase,
            data,
            teamIndex,
        }: {
            tournamentId: string;
            groupId: string;
            phase: string;
            data?: any;
            teamIndex: number;
        }) => updateGroupPoints({ tournamentId, groupId, phase, data, teamIndex }),
    });
};
