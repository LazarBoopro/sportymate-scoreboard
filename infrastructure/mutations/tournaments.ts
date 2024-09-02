import { useMutation } from "@tanstack/react-query";
import {
  addTournament,
  deleteTournament,
  updateTournament,
} from "../services/tournaments";

export const useAddTournament = () => {
  return useMutation({
    // @ts-ignore
    mutationFn: (data: any) => addTournament(data),
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
    }) => updateTournament({ id, data, path }),
  });
};
