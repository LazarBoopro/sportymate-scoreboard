import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import WatchStatus from "@/ui/components/atoms/WatchStatus.atom";
import BubbleAnimations from "@/ui/components/atoms/BubbleAnimation.atom";

import { MatchType } from "@/interfaces/matches";

import { scores } from "@/lib/helpers/score";
import { checkStatusMessage } from "@/lib/helpers/messages";

import logo from "@/public/img/logoGreen.svg";
import { IoTennisball } from "react-icons/io5";

export default function WatchTournament({
  tournament,
  isTie,
  winner,
}: {
  winner?: string | null;
  isTie: boolean;
  tournament: MatchType | null;
}) {
  const status = tournament?.status?.status.toLowerCase().replaceAll(" ", "");

  const printScore = ({ team }: { team: number }) => {
    if (isTie) {
      return tournament?.score?.tiebreak[team];
    }

    if (tournament?.type == 1 && tournament?.score?.sets?.length === 3) {
      return tournament?.score?.currentSet[team]!;
    } else {
      return scores[tournament?.score?.currentSet[team]!];
    }
  };

  if (
    status !== "inprogress" &&
    status !== "tiebreak" &&
    status !== "completed"
  ) {
    return (
      <AnimatePresence>
        <WatchStatus
          status={checkStatusMessage(tournament?.status?.status ?? "idle")}
          winner={
            winner ? tournament?.players?.[winner as "host" | "guest"]! : null
          }
        />
      </AnimatePresence>
    );
  }

  return (
    <section className="match-view">
      <h1 className="match-view__title">
        {tournament?.title}

        <AnimatePresence>
          {isTie && (
            <motion.p
              initial={{
                opacity: 0,
                y: "-100%",
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: "-100%",
              }}
              className="subtitle"
            >
              {!tournament?.superTieBreak ? "Tie Break" : "Super Tie Break"}
            </motion.p>
          )}
        </AnimatePresence>
      </h1>

      <Link className="match-view__logo" href={"/"}>
        <Image src={logo} alt="SportyMate" />
      </Link>
      <div className="match-view__body">
        <div className="team host">
          <div className="team__players">
            {[1, 2]?.map((n, i: number) => (
              <p
                key={i}
                style={{ opacity: winner && winner !== "host" ? 0.25 : 1 }}
              >
                {/* @ts-ignore */}
                {`${tournament?.players.host[`player${n}`].firstName}  ${
                  // @ts-ignore
                  tournament?.players.host[`player${n}`].lastName
                }`}
                <AnimatePresence>
                  {/* @ts-ignore */}

                  {tournament?.players.host[`player${n}`].serving && (
                    <motion.span
                      initial={{
                        opacity: 0,
                        x: -200,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      exit={{
                        opacity: 0,
                        x: -200,
                      }}
                    >
                      <IoTennisball />
                    </motion.span>
                  )}
                </AnimatePresence>
              </p>
            ))}
          </div>

          <div className="team__score">
            <div className="sets">
              <AnimatePresence>
                {!isTie &&
                  tournament?.score?.sets.map((n, i) => (
                    <motion.p
                      initial={{
                        opacity: 0,
                        y: "-100%",
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        y: "-100%",
                      }}
                      transition={{
                        delay: i * 0.025,
                      }}
                      key={i}
                      style={{
                        color:
                          i !== (tournament?.score?.sets.length ?? 1) - 1
                            ? n?.[1] < n?.[0]
                              ? "red"
                              : "gray"
                            : undefined,
                        // backgroundColor:
                        //   i === (tournament?.score?.sets.length ?? 1) - 1
                        //     ? "red"
                        //     : undefined,
                      }}
                    >
                      {n?.[0]}
                    </motion.p>
                  ))}
              </AnimatePresence>
            </div>

            <div className="gem">{printScore({ team: 0 })}</div>
          </div>
        </div>
        <div className="line" />
        <div
          className="team guest"
          // style={{ opacity: winner && winner !== "guest" ? 0.25 : 1 }}
        >
          <div className="team__players">
            {[1, 2]?.map((n, i: number) => (
              <p
                key={i}
                style={{ opacity: winner && winner !== "guest" ? 0.25 : 1 }}
              >
                {/* @ts-ignore */}
                {`${tournament?.players.guest[`player${n}`].firstName}  ${
                  // @ts-ignore
                  tournament?.players.guest[`player${n}`].lastName
                }`}
                <AnimatePresence>
                  {/* @ts-ignore */}

                  {tournament?.players.guest[`player${n}`].serving && (
                    <motion.span
                      initial={{
                        opacity: 0,
                        x: -200,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      exit={{
                        opacity: 0,
                        x: -200,
                      }}
                    >
                      <IoTennisball />
                    </motion.span>
                  )}
                </AnimatePresence>
              </p>
            ))}
          </div>

          <div className="team__score">
            <div className="sets">
              <AnimatePresence>
                {!isTie &&
                  tournament?.score?.sets.map((n, i) => (
                    <motion.p
                      initial={{
                        opacity: 0,
                        y: "100%",
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        y: "100%",
                      }}
                      transition={{
                        delay: i * 0.025,
                      }}
                      key={i}
                      style={{
                        color:
                          i !== (tournament?.score?.sets.length ?? 1) - 1
                            ? n?.[1] > n?.[0]
                              ? "red"
                              : "gray"
                            : undefined,
                      }}
                    >
                      {n?.[1]}
                    </motion.p>
                  ))}
              </AnimatePresence>
            </div>

            <div className="gem">{printScore({ team: 1 })}</div>
          </div>
        </div>
      </div>
      <BubbleAnimations />
    </section>
  );
}
