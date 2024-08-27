import { useMutation } from "@tanstack/react-query";
import { addTournament } from "../services/tournaments";

export const useAddTournament = () => {
  return useMutation({
    // @ts-ignore
    mutationFn: (data: any) => addTournament(data),
  });
};
