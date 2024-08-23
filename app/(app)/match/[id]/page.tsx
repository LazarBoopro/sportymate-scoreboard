"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import WatchTournament from "@/ui/components/organism/WatchTournament.organism";
import RefereeTournament from "@/ui/components/organism/RefereeTournament.organism";
import WatchStatus from "@/ui/components/atoms/WatchStatus.atom";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebaseConfig";

import { useGetSingleTournament } from "@/infrastructure/queries/tournaments";

import useSingleTournament from "@/ui/hooks/useSingleTournament.hook";

import "@/ui/styles/pages/match.page.scss";

export default function Match({ params }: { params: { id: string } }) {
  const [user] = useAuthState(auth);
  const searchParams = useSearchParams();
  const router = useRouter();

  const isWatchMode = searchParams.get("watch");

  const { data, isSuccess, isLoading } = useGetSingleTournament(params.id);
  const { tieBreak, tournament, handleUpdateCurrentSetScore } =
    useSingleTournament({
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
    return <WatchStatus status="Učitavam" />;
  }

  if (isWatchMode || !user?.uid) {
    return (
      <WatchTournament
        winner={tournament?.winner}
        isTie={tieBreak}
        tournament={tournament}
      />
    );
  }

  return (
    <>
      <RefereeTournament
        isTie={tieBreak}
        tournament={tournament}
        handleUpdateCurrentSetScore={handleUpdateCurrentSetScore}
      />
    </>
  );
}
