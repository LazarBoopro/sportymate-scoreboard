"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import WatchTournament from "@/ui/components/organism/WatchTournament.organism";
import RefereeTournament from "@/ui/components/organism/RefereeTournament.organism";
import WatchStatus from "@/ui/components/atoms/WatchStatus.atom";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebaseConfig";

import { useGetSingleMatch } from "@/infrastructure/queries/tournaments";

import useSingleMatch from "@/ui/hooks/useSingleMatch.hook";

import liveLogo from "@/public/img/logo.svg";

import "@/ui/styles/pages/match.page.scss";
import { scores } from "@/lib/helpers/score";
import Image from "next/image";

export default function Match({ params }: { params: { id: string } }) {
  const [user] = useAuthState(auth);
  const searchParams = useSearchParams();

  const size = searchParams.get("size");

  const isWatchMode = searchParams.get("watch");

  // const { data, isSuccess, isLoading } = useGetSingleMatch(params.id, );
  const { tieBreak, match, handleUpdateCurrentSetScore, handleGemPoint } =
    useSingleMatch({
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
      // router.replace(`/match/${params.id}/s/?watch=true`);
    }
  }, [user]);

  if (size) {
    return (
      <section className="tv-overlay">
        <Image src={liveLogo} alt="S" />
        <div className="table">
          <div className="table__team">
            <div className="players">
              <p className="player">{`${match?.players?.host?.player1?.firstName?.[0]}. ${match?.players?.host?.player1?.lastName}`}</p>
              <p className="player">{`${match?.players?.host?.player2?.firstName?.[0]}. ${match?.players?.host?.player2?.lastName}`}</p>
            </div>
            <div className="score">
              <p className="current-set">
                {match?.score?.sets?.[match?.score?.sets?.length - 1][0]}
              </p>
              {/* <p className="current-gem">
                {scores[match?.score?.currentSet?.[0]!]}
              </p> */}
              <div className="sets">
                {match?.score?.sets.map((n, i) => (
                  <p key={i} className="set">
                    {n[0]}
                  </p>
                ))}
              </div>
            </div>
          </div>
          <div className="table__team">
            <div className="players">
              <p className="player">{`${match?.players?.guest?.player1?.firstName?.[0]}. ${match?.players?.guest?.player1?.lastName}`}</p>
              <p className="player">{`${match?.players?.guest?.player2?.firstName?.[0]}. ${match?.players?.guest?.player2?.lastName}`}</p>
            </div>
            <div className="score">
              <p className="current-set">
                {match?.score?.sets?.[match?.score?.sets?.length - 1][1]}
              </p>
              {/* <p className="current-gem">
                {scores[match?.score?.currentSet?.[1]!]}
              </p> */}
              <div className="sets">
                {match?.score?.sets.map((n) => (
                  <p key={i} className="set">
                    {n[1]}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
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
      />
    </>
  );
}
