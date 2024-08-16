import { scores } from "@/lib/helpers/score";
import { Fragment } from "react";
import { AnimatePresence, motion } from "framer-motion";

type ScoreType = {
  currentSet: number[];
  tiebreak: number[];
  sets: number[][];
};

export function Score({
  score,
  isTie,
  superTieBreak,
  matchType,
}: {
  score: ScoreType | null;
  superTieBreak: boolean;
  isTie: boolean;
  matchType: string;
}) {
  return (
    <div className="match__score">
      <div className={`score ${isTie ? "tie" : ""}`}>
        <AnimatePresence>
          {isTie && (
            <motion.div
              initial={{
                overflow: "hidden",
                position: "absolute",
                left: "100%",
              }}
              animate={{
                position: "relative",
                left: 0,
              }}
              exit={{
                position: "absolute",
                left: "-100%",
              }}
            >
              <h1>{superTieBreak && <span>Super</span>}TieBreak</h1>
              <div className="score__body">
                <span>{score?.tiebreak[0] || 0}</span>
                <span>:</span>
                <span>{score?.tiebreak[1] || 0}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {!isTie && (
            <>
              <span
                style={{
                  position: "absolute",
                  fontSize: "1rem",
                  fontWeight: "300",
                  top: "-.25rem",
                  right: "50%",
                  transform: "translateX(50%)",
                }}
              >
                {matchType}
              </span>
              <motion.div
                initial={{
                  overflow: "hidden",
                  position: "absolute",
                  left: "100%",
                }}
                animate={{
                  position: "relative",
                  left: 0,
                }}
                exit={{
                  position: "absolute",
                  left: "-100%",
                }}
              >
                <span>{scores[score?.currentSet?.[0] || 0]}</span>
                <span>:</span>
                <span>{scores[score?.currentSet?.[1] || 0]}</span>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
      <div className="sets">
        {score?.sets.map((n, i) => (
          <Fragment key={i}>
            <p key={i}>
              {n?.[0]} : {n?.[1]}
            </p>

            <p className="slash">{score.sets.length - 1 !== i ? "/" : ""}</p>
          </Fragment>
        ))}
      </div>

      {/* <div className="tiebreak">
        <p>Tiebreak:</p>
        <p>{score?.tiebreak?.[0]}</p>
        <p>{score?.tiebreak?.[1]}</p>
      </div> */}
    </div>
  );
}
