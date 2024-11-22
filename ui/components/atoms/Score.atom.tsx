import { scores } from "@/lib/helpers/score";
import { Fragment, useContext, Dispatch, SetStateAction } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { match } from "assert";
import Button from "./Button.atom";
import Context from "@/ui/providers/NavbarContext.provider";
import { LucideTrash2 } from "lucide-react";

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
  setSelectedSet,
  selectedSet,
  handleSetWinner,
  setTieBreak,
  resetTieBreakScore,
  addNewSet,
}: {
  handleSetWinner: CallableFunction;
  score: ScoreType | null;
  superTieBreak: boolean;
  isTie: boolean;
  matchType: string;
  setSelectedSet: Dispatch<SetStateAction<number>>;
  selectedSet: number;
  setTieBreak: Dispatch<SetStateAction<boolean>>;
  resetTieBreakScore: CallableFunction;
  addNewSet: (action?: "add" | "remove") => void;
}) {
  const { match } = useContext(Context);

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

      <div className="add-set">
        <Button
          type="danger"
          className="add-button"
          onClick={() => {
            addNewSet("add");
          }}
        >
          +
        </Button>

        <Button
          type="danger"
          className="add-button"
          onClick={() => {
            addNewSet("remove");
          }}
        >
          -
        </Button>
      </div>

      <div className="sets">
        {score?.sets?.map?.((n, i) => (
          <Fragment key={i}>
            <Button
              onClick={() => {
                setSelectedSet(i);
              }}
              type={i === selectedSet ? "primary" : "transparent"}
              className="single"
            >
              <p key={i}>
                {n?.[0]} : {n?.[1]}
              </p>
            </Button>

            <p className="slash">{score.sets.length - 1 !== i ? "/" : ""}</p>
          </Fragment>
        ))}
      </div>

      <div className="tie-break-buttons">
        <Button
          type="danger"
          onClick={() => {
            if (score?.sets?.[selectedSet]) {
              if (score.sets[selectedSet][0] !== score.sets[selectedSet][1]) {
                return;
              }
            }
            setTieBreak(true);
          }}
        >
          TIE BREAK
        </Button>
        <Button
          type="danger"
          onClick={() => {
            resetTieBreakScore(0);
          }}
        >
          END TIE BREAK
        </Button>
      </div>

      {match?.winner && (
        <div className="winner">
          <p className="winner_label">Pobednik</p>
          <div className="winner__body">
            <p className="team">{match?.winner}</p>
            <Button type="danger" onClick={() => handleSetWinner(null, false)}>
              <LucideTrash2 />
            </Button>
          </div>
        </div>
      )}
      {/* <div className="tiebreak">
        <p>Tiebreak:</p>
        <p>{score?.tiebreak?.[0]}</p>
        <p>{score?.tiebreak?.[1]}</p>
      </div> */}
    </div>
  );
}
