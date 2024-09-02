import { useMutation } from "@tanstack/react-query";
import { addGroup, deleteGroup, updateGroupPoints } from "../services/groups";
import { GroupType } from "@/interfaces/tournaments";
import { GroupPhaseEnum } from "@/interfaces/enums";
import { FirebaseError } from "firebase/app";

export const useAddGroup = (onError: (err: FirebaseError) => void) => {
  return useMutation({
    // @ts-ignore
    mutationFn: ({
      data,
      tournamentId,
      groupId,
      phase,
    }: {
      data: GroupType;
      tournamentId: string;
      groupId: string;
      phase: GroupPhaseEnum;
    }) => addGroup(data, tournamentId, groupId, phase),
    onError: onError,
  });
};

export const useDeleteGroup = (onError: (err: FirebaseError) => void) => {
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
    onError: onError,
  });
};

export const useUpdateGroupPoints = (onError: (err: FirebaseError) => void) => {
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
      data: { wins: number; losses: number };
      teamIndex: number;
    }) => updateGroupPoints({ tournamentId, groupId, phase, data, teamIndex }),
    onError: onError,
  });
};
