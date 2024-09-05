"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { GroupPhaseEnum } from "@/interfaces/enums";
import { TeamType, TournamentQueryParams } from "@/interfaces/tournaments";

import { GroupRow } from "@/ui/components/moleculs/GroupRow.molecul";
import TournamentCard from "@/ui/components/moleculs/TournamentCard.molecul";

import { IoChevronBack } from "react-icons/io5";

import useSingleTournament from "@/ui/hooks/useSingleTournament.hook";

import "@/ui/styles/pages/group.page.scss";
import { MatchType } from "@/interfaces/matches";

export default function TournamentGroup({
  params,
}: {
  params: { id: string; group: string };
}) {
  const router = useRouter();
  const queryParams = useSearchParams();

  const { singleGroup, updateGroup, matches } = useSingleTournament({
    id: params.id,
    groupId: params.group,
  });

  function handleUpdateGroup(
    teamId: number,
    data: { wins: number; losses: number }
  ) {
    updateGroup({
      tournamentId: params.id,
      data: data,
      groupId: params.group,
      phase:
        (queryParams.get("phase") as GroupPhaseEnum) ?? GroupPhaseEnum.GROUPS,
      teamIndex: teamId,
    });
  }

  if (!singleGroup) return <div>No group found...</div>;

  return (
    <Suspense>
      <section className="tournament-group">
        <div
          className="header"
          style={{
            display: "flex",
            gap: ".5rem",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <button
            onClick={() => router.back()}
            style={{
              padding: ".25rem",
              width: "2rem",
              height: "2rem",
              background: "#eee",
              color: "black",
              aspectRatio: "1",
              borderRadius: "100rem",
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <IoChevronBack />
          </button>
          <h1>Grupa {singleGroup.name}</h1>
        </div>

        <div className="table">
          <h2>Tabela</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Igraci</th>
                <th>Broj pobeda</th>
                <th>Broj poraza</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {singleGroup.teams?.map((team: TeamType, i: number) => (
                <GroupRow
                  key={i}
                  team={team}
                  index={i}
                  handleUpdateGroup={handleUpdateGroup}
                />
              ))}
            </tbody>
          </table>
        </div>

        <div className="matches">
          <h2>Mecevi</h2>
          <div className="matches-list">
            <Matches
              matches={matches}
              tournament={{
                tournamentId: params.id,

                groupId: params.group,
                phase:
                  (queryParams.get("phase") as GroupPhaseEnum) ??
                  GroupPhaseEnum.GROUPS,
              }}
            />
          </div>
        </div>
      </section>
    </Suspense>
  );
}

function Matches({
  matches,
  tournament,
}: {
  matches:
    | {
        [matchId: string]: MatchType;
      }
    | null
    | undefined;
  tournament: TournamentQueryParams;
}) {
  console.log(matches);
  if (!matches) return null;
  return Object.keys(matches)?.map?.((n, i) => (
    <TournamentCard key={i} id={n} {...matches[n]} tournament={tournament} />
  ));
}
