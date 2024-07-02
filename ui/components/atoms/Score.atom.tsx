import { scores } from "@/lib/helpers/score";
import { Fragment } from "react";

type ScoreType = {
  currentSet: number[];
  sets: { [key: string]: number }[];
};

export function Score({ score }: { score: ScoreType | null }) {
  return (
    <div className="match__score">
      <div className="score">
        <span>{scores[score?.currentSet?.[0] || 0]}</span>
        <span>:</span>
        <span>{scores[score?.currentSet?.[1] || 0]}</span>
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
    </div>
  );
}
