"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebaseConfig";

import { Team } from "@/ui/components/moleculs/Team.molecul";
import { Score, scores } from "@/ui/components/atoms/Score.atom";
import SelectField from "@/ui/components/moleculs/Select.molecul";

import { useGetSingleTournament } from "@/infrastructure/queries/tournaments";

import useSingleTournament from "@/ui/hooks/useSingleTournament";

import logo from "@/public/img/logoGreen.svg";

import "@/ui/styles/pages/match.page.scss";

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
      <section className="match-view">
        <h1 className="match-view__title">
          {tournament?.title}
          <span className="status">{tournament?.status.status}</span>
        </h1>
        <Link className="match-view__logo" href={"/"}>
          <Image src={logo} alt="SportyMate" />
        </Link>
        <div className="match-view__body">
          <div className="team host">
            <div className="team__players">
              {tournament?.players.host?.map((n, i: number) => (
                <p key={i}>{`${n.firstName}  ${n.lastName}`}</p>
              ))}
            </div>

            <div className="team__score">
              <div className="sets">
                {tournament?.score.sets.map((n, i) => (
                  <p key={i}>{n?.[0]}</p>
                ))}
              </div>

              <div className="gem">
                {scores[tournament?.score.currentSet[0]!]}
              </div>
            </div>
          </div>
          {/* <Team team={0} players={tournament?.players.host} /> */}
          <div className="line" />
          <div className="team guest">
            <div className="team__players">
              {tournament?.players.guest?.map((n, i: number) => (
                <p key={i}>{`${n.firstName}  ${n.lastName}`}</p>
              ))}
            </div>

            <div className="team__score">
              <div className="sets">
                {tournament?.score.sets.map((n, i) => (
                  <p key={i}>{n?.[1]}</p>
                ))}
              </div>

              <div className="gem">
                {scores[tournament?.score.currentSet[1]!]}
              </div>
            </div>
          </div>
          {/* <Team team={1} players={tournament?.players.guest} /> */}
        </div>
      </section>
    );
  }

  return (
    <>
      <main className="match">
        <Suspense fallback={null}>
          <Team
            team={0}
            players={tournament?.players.host}
            handleChange={handleUpdateCurrentSetScore}
          />
          <div className="match__section">
            <SelectField defaultSelected={tournament?.status.status ?? ""} />
            <Score score={tournament?.score ?? null} />
          </div>
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
