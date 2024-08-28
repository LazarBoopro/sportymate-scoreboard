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

    const { data, isSuccess, isLoading } = useGetSingleMatch(params.id);
    const { tieBreak, match, handleUpdateCurrentSetScore } = useSingleMatch({
        id: params.id,
    });

    useEffect(() => {
        if (isSuccess && !user) {
            router.replace("/login");
        }

        if (isSuccess && data.userId !== user?.uid) {
            router.replace("/");
        }
    }, [isSuccess, user]);

    if (isLoading) {
        return <WatchStatus status="Učitavam" />;
    }

    if (isWatchMode || !user?.uid) {
        return <WatchTournament winner={match?.winner} isTie={tieBreak} tournament={match} />;
    }

    return (
        <>
            <RefereeTournament
                isTie={tieBreak}
                tournament={match}
                handleUpdateCurrentSetScore={handleUpdateCurrentSetScore}
            />
        </>
    );
}
