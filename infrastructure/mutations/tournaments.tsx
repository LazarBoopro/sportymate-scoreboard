"use client";

import { useMutation } from "@tanstack/react-query";
import { addTournament, deleteTournament } from "../services/touirnaments";

export const useAddTournament = () => {
  return useMutation({
    // @ts-ignore TODO: CHECK TYPE
    mutationFn: (data: any) => addTournament(data),
  });
};

export const useDeleteTournament = () => {
  return useMutation({
    mutationFn: (id: string) => deleteTournament(id),
  });
};
