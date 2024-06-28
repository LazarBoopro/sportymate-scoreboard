"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebaseConfig";

import { Team } from "@/ui/components/moleculs/Team.molecul";
import { Score, scores } from "@/ui/components/atoms/Score.atom";

import { useGetSingleTournament } from "@/infrastructure/queries/tournaments";

import useSingleTournament from "@/ui/hooks/useSingleTournament";

import "@/ui/styles/pages/match.page.scss";
import Navbar from "@/ui/components/moleculs/Navbar.molecul";
import SelectField from "@/ui/components/moleculs/Select.molecul";

export default function Match({ params }: { params: { id: string } }) {
  const [user] = useAuthState(auth);
  const searchParams = useSearchParams();
  const router = useRouter();

  const isWatchMode = searchParams.get("watch");

  const { data, isSuccess, isLoading } = useGetSingleTournament(params.id);
  const { tournament, handleUpdateCurrentSetScore } = useSingleTournament({
    id: params.id,
  });

  useEffect(() => {
    if (isSuccess && !user) {
      router.replace("/login");
    }

    if (isSuccess && data.userId !== user?.uid) {
      router.replace("/");
    }
  }, [isSuccess]);

  if (isLoading) {
    return <h1>Loading..</h1>;
  }

  if (isWatchMode) {
    return (
      <section>
        <h1> I am watching this game with id {params.id}!</h1>;
        <p>
          {scores[tournament?.score.currentSet[0] || 0]}:
          {scores[tournament?.score.currentSet[1] || 0]}
        </p>
      </section>
    );
  }

  return (
    <>
      <Navbar />
      <SelectField defaultSelected={tournament?.status.status ?? ""} />
      <main className="match">
        <Suspense fallback={null}>
          <Team
            team={0}
            players={tournament?.players.host}
            handleChange={handleUpdateCurrentSetScore}
          />
          <Score score={tournament?.score ?? null} />
          <Team
            team={1}
            players={tournament?.players.guest}
            handleChange={handleUpdateCurrentSetScore}
          />
        </Suspense>
      </main>
    </>
  );
}
