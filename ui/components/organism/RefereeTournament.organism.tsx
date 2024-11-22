import { SetStateAction, Suspense, Dispatch } from "react";
import { Team } from "../moleculs/Team.molecul";
import SelectField from "../moleculs/SelectStatus.molecul";
import { Score } from "../atoms/Score.atom";
import { MatchType } from "@/interfaces/matches";
import { MATCH_TYPES } from "@/lib/constants/match";

export default function RefereeTournament({
  tournament,
  handleUpdateCurrentSetScore,
  isTie,
  handleChangeGemPoint,
  setSelectedSet,
  selectedSet,
  handleSetWinner,
  setTieBreak,
  addNewSet,
}: {
  handleSetWinner: (
    winner: "host" | "guest" | null,
    finishMatch: boolean
  ) => void;
  isTie: boolean;
  tournament: MatchType | null;
  handleUpdateCurrentSetScore: CallableFunction;
  handleChangeGemPoint: CallableFunction;
  setSelectedSet: Dispatch<SetStateAction<number>>;
  selectedSet: number;
  setTieBreak: Dispatch<SetStateAction<boolean>>;
  addNewSet: () => void;
}) {
  return (
    <main className="match">
      <Suspense fallback={null}>
        <Team
          team={0}
          players={tournament?.players.host}
          handleChange={handleUpdateCurrentSetScore}
          status={tournament?.status?.status!}
          handleChangeGemPoint={handleChangeGemPoint}
          handleSetWinner={handleSetWinner}
        />
        <div className="match__section">
          <SelectField defaultSelected={tournament?.status?.status ?? ""} />
          <Score
            isTie={isTie}
            superTieBreak={tournament?.superTieBreak ?? false}
            score={tournament?.score ?? null}
            matchType={MATCH_TYPES?.[tournament?.type || 0].title}
            setSelectedSet={setSelectedSet}
            selectedSet={selectedSet}
            handleSetWinner={handleSetWinner}
            setTieBreak={setTieBreak}
            addNewSet={addNewSet}
          />
        </div>
        <Team
          team={1}
          players={tournament?.players.guest}
          handleChange={handleUpdateCurrentSetScore}
          status={tournament?.status?.status!}
          handleChangeGemPoint={handleChangeGemPoint}
          handleSetWinner={handleSetWinner}
        />
      </Suspense>
    </main>
  );
}
