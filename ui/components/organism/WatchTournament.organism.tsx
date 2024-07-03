import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import WatchStatus from "@/ui/components/atoms/WatchStatus.atom";
import BubbleAnimations from "@/ui/components/atoms/BubbleAnimation.atom";

import { TournamentType } from "@/interfaces/tournaments";

import { scores } from "@/lib/helpers/score";
import { checkStatusMessage } from "@/lib/helpers/messages";

import logo from "@/public/img/logoGreen.svg";
import { IoTennisball } from "react-icons/io5";

export default function WatchTournament({
  tournament,
  isTie,
}: {
  isTie: boolean;
  tournament: TournamentType | null;
}) {
  const status = tournament?.status?.status.toLowerCase().replace(" ", "");

  if (status !== "inprogress" && status !== "tiebreak") {
    return (
      <AnimatePresence>
        <WatchStatus
          status={checkStatusMessage(tournament?.status?.status ?? "idle")}
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
              Tie Break
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
            {tournament?.players.host?.map((n, i: number) => (
              <p key={i}>
                {`${n.firstName}  ${n.lastName}`}
                <AnimatePresence>
                  {n.serving && (
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
                    >
                      {n?.[0]}
                    </motion.p>
                  ))}
              </AnimatePresence>
            </div>

            <div className="gem">
              {isTie
                ? tournament?.score?.tiebreak[0]
                : scores[tournament?.score?.currentSet[0]!]}
            </div>
          </div>
        </div>
        <div className="line" />
        <div className="team guest">
          <div className="team__players">
            {tournament?.players.guest?.map((n, i: number) => (
              <p key={i}>
                {`${n.firstName}  ${n.lastName}`}
                <AnimatePresence>
                  {n.serving && (
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
                    >
                      {n?.[1]}
                    </motion.p>
                  ))}
              </AnimatePresence>
            </div>

            <div className="gem">
              {isTie
                ? tournament?.score?.tiebreak[1]
                : scores[tournament?.score?.currentSet[1]!]}
            </div>
          </div>
        </div>
      </div>
      <BubbleAnimations />
    </section>
  );
}