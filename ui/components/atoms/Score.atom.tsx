type ScoreType = {
  currentSet: number[];
  sets: { [key: string]: number }[];
};

export function Score({ score }: { score: ScoreType | null }) {
  return (
    <div className="match__section middle">
      <div className="score">
        <span>{scores[score?.currentSet?.[0] || 0]}</span>
        <span>:</span>
        <span>{scores[score?.currentSet?.[1] || 0]}</span>
      </div>
      <div className="sets">
        {score?.sets.map((n, i) => (
          <p key={i}>
            {n?.[0]} : {n?.[1]}
          </p>
        ))}
      </div>
    </div>
  );
}

export const scores = [0, 15, 30, 40, "AD", "POINT"];
