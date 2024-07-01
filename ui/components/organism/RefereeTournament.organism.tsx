import { Suspense } from "react";
import { Team } from "../moleculs/Team.molecul";
import SelectField from "../moleculs/Select.molecul";
import { Score } from "../atoms/Score.atom";
import { TournamentType } from "@/interfaces/tournaments";

export default function RefereeTournament({
  tournament,
  handleUpdateCurrentSetScore,
}: {
  tournament: TournamentType | null;
  handleUpdateCurrentSetScore: CallableFunction;
}) {
  return (
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
  );
}
