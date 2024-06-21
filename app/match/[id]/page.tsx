"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { useGetSingleTournament } from "@/infrastructure/queries/tournaments";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebaseConfig";
import { useEffect } from "react";

export default function Match({ params }: { params: { id: string } }) {
  const [user] = useAuthState(auth);
  const searchParams = useSearchParams();
  const router = useRouter();

  const isWatchMode = searchParams.get("watch");

  const { data, isSuccess } = useGetSingleTournament(params.id);

  useEffect(() => {
    if (isSuccess && !user) {
      router.replace("/login");
    }

    if (isSuccess && data.userId !== user?.uid) {
      router.replace("/");
    }
  }, [isSuccess]);

  if (isWatchMode) {
    return <h1> I am watching this game with id {params.id}!</h1>;
  }

  return (
    <h1>
      I am referee for game with id: {params.id} and title is {data?.title}{" "}
      where players are
      {data?.players?.guest?.map((n) => (
        <p>
          {n.firstName}
          {n.lastName}
        </p>
      ))}
    </h1>
  );
}
