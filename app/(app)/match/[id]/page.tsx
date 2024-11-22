"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import WatchTournament from "@/ui/components/organism/WatchTournament.organism";
import RefereeTournament from "@/ui/components/organism/RefereeTournament.organism";
import WatchStatus from "@/ui/components/atoms/WatchStatus.atom";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebaseConfig";

import useSingleMatch from "@/ui/hooks/useSingleMatch.hook";

import "@/ui/styles/pages/match.page.scss";

import WatchTVOverlay from "@/ui/components/moleculs/WatchTVOverlay.molecul";

export default function Match({ params }: { params: { id: string } }) {
  const [user] = useAuthState(auth);
  const searchParams = useSearchParams();

  const size = searchParams.get("size");

  const isWatchMode = searchParams.get("watch");

  const {
    tieBreak,
    match,

    handleUpdateCurrentSetScore,
    handleGemPoint,
    setSelectedSet,
    selectedSet,
    handleSetWinner,
    setTieBreak,
    resetTieBreakScore,
  } = useSingleMatch({
    id: params.id,
    tournament: searchParams.get("tournamentId")
      ? {
          tournamentId: searchParams.get("tournamentId") ?? "",
          groupId: searchParams.get("groupId") ?? "",
          phase: searchParams.get("phase") ?? "",
        }
      : undefined,
  });

  // useEffect(() => {
  // if (!user) {
  // router.replace(`/match/${params.id}/s/?watch=true`);
  // }
  // }, [user]);

  if (size) {
    return <WatchTVOverlay match={match} isTieBreak={tieBreak} />;
  }

  if (isWatchMode || !user?.uid) {
    return (
      <WatchTournament
        winner={match?.winner}
        isTie={tieBreak}
        tournament={match}
      />
    );
  }

  return (
    <>
      <RefereeTournament
        isTie={tieBreak}
        tournament={match}
        handleUpdateCurrentSetScore={handleUpdateCurrentSetScore}
        handleChangeGemPoint={handleGemPoint}
        setSelectedSet={setSelectedSet}
        selectedSet={selectedSet}
        handleSetWinner={handleSetWinner}
        setTieBreak={setTieBreak}
        resetTieBreakScore={resetTieBreakScore}
      />
    </>
  );
}
