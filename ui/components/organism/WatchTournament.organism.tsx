import Image from "next/image";
import Link from "next/link";

import WatchStatus from "../atoms/WatchStatus.atom";

import { TournamentType } from "@/interfaces/tournaments";

import logo from "@/public/img/logoGreen.svg";
import { AnimatePresence } from "framer-motion";
import BubbleAnimations from "../atoms/BubbleAnimation.atom";
import { scores } from "@/lib/helpers/score";

export default function WatchTournament({
  tournament,
}: {
  tournament: TournamentType | null;
}) {
  const status = tournament?.status?.status.toLowerCase().replace(" ", "");

  if (status !== "inprogress") {
    return (
      <AnimatePresence>
        <WatchStatus status={tournament?.status?.status} />;
      </AnimatePresence>
    );
  }

  return (
    <section className="match-view">
      <h1 className="match-view__title">
        {tournament?.title}
        {/* <span className="status">{tournament?.status.status}</span> */}
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
              {tournament?.score?.sets.map((n, i) => (
                <p key={i}>{n?.[0]}</p>
              ))}
            </div>

            <div className="gem">
              {scores[tournament?.score?.currentSet[0]!]}
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
              {tournament?.score?.sets.map((n, i) => (
                <p key={i}>{n?.[1]}</p>
              ))}
            </div>

            <div className="gem">
              {scores[tournament?.score?.currentSet[1]!]}
            </div>
          </div>
        </div>
        {/* <Team team={1} players={tournament?.players.guest} /> */}
      </div>
      <BubbleAnimations />
    </section>
  );
}
