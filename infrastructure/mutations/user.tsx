"use client";

import { useMutation } from "@tanstack/react-query";
import { signIn, signOutUser } from "../services/user";

export const useUserSignIn = (onSuccess: () => void) => {
  return useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      signIn(credentials.email, credentials.password),
    onSuccess: () => onSuccess(),
  });
};

export const useSignOutUser = () => {
  return useMutation({
    mutationFn: () => signOutUser(),
  });
};
