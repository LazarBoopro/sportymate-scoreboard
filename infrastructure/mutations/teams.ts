import { useMutation } from "@tanstack/react-query";
import { addTeam, deleteTeam, updateTeam } from "../services/teams";
import { TeamType } from "@/interfaces/tournaments";
import { FirebaseError } from "firebase/app";

export const useAddTeam = (onError: (err: FirebaseError) => void) => {
  return useMutation({
    // @ts-ignore
    mutationFn: ({
      tournamentId,
      data,
    }: {
      tournamentId: string;
      data: TeamType;
    }) => addTeam(tournamentId, data),
    onError,
  });
};

export const useDeleteTeam = (onError: (err: FirebaseError) => void) => {
  return useMutation({
    mutationFn: ({
      tournamentId,
      teamId,
    }: {
      tournamentId: string;
      teamId: string;
    }) => deleteTeam(tournamentId, teamId),
    onError,
  });
};

export const useUpdateTeam = (onError: (err: FirebaseError) => void) => {
  return useMutation({
    mutationFn: ({
      tournamentId,
      teamId,
      data,
    }: {
      tournamentId: string;
      teamId: string;
      data: TeamType;
    }) => updateTeam({ tournamentId, teamId, data }),
    onError,
  });
};
