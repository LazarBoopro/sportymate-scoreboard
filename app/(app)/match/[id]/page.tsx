"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import WatchTournament from "@/ui/components/organism/WatchTournament.organism";
import RefereeTournament from "@/ui/components/organism/RefereeTournament.organism";
import WatchStatus from "@/ui/components/atoms/WatchStatus.atom";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebaseConfig";

import { useGetSingleMatch } from "@/infrastructure/queries/tournaments";

import useSingleMatch from "@/ui/hooks/useSingleMatch.hook";

import "@/ui/styles/pages/match.page.scss";

export default function Match({ params }: { params: { id: string } }) {
    const [user] = useAuthState(auth);
    const searchParams = useSearchParams();
    const router = useRouter();

    const isWatchMode = searchParams.get("watch");

    // const { data, isSuccess, isLoading } = useGetSingleMatch(params.id, );
    const { tieBreak, match, handleUpdateCurrentSetScore, handleGemPoint } = useSingleMatch({
        id: params.id,
        tournament: searchParams.get("tournamentId")
            ? {
                  tournamentId: searchParams.get("tournamentId") ?? "",
                  groupId: searchParams.get("groupId") ?? "",
                  phase: searchParams.get("phase") ?? "",
              }
            : undefined,
    });

    useEffect(() => {
        if (!user) {
            router.replace("/login");
        }
    }, [user]);

    // if (isLoading) {
    //     return <WatchStatus status="Učitavam" />;
    // }

    if (isWatchMode || !user?.uid) {
        return <WatchTournament winner={match?.winner} isTie={tieBreak} tournament={match} />;
    }

    return (
        <>
            <RefereeTournament
                isTie={tieBreak}
                tournament={match}
                handleUpdateCurrentSetScore={handleUpdateCurrentSetScore}
                handleChangeGemPoint={handleGemPoint}
            />
        </>
    );
}
