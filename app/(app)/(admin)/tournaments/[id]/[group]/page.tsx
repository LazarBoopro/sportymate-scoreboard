"use client";

import { GroupPhaseEnum } from "@/interfaces/tournaments";
import Button from "@/ui/components/atoms/Button.atom";
import TournamentCard from "@/ui/components/moleculs/TournamentCard.molecul";
import useMatches from "@/ui/hooks/useMatches";
import useSingleTournament from "@/ui/hooks/useSingleTournament.hook";
import "@/ui/styles/pages/group.page.scss";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  IoChevronBack,
  IoCloseSharp,
  IoPencilSharp,
  IoSave,
} from "react-icons/io5";

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
            {singleGroup.teams?.map((team: any, i: number) => (
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
  );
}

function GroupRow({ team, index, handleUpdateGroup }: any) {
  const [info, setInfo] = useState({
    wins: team?.wins ?? 0,
    losses: team?.losses ?? 0,
  });

  const [editing, setEditing] = useState(false);

  const handleClick = () => {
    setEditing(false);

    if (editing) {
      setEditing(false);

      const originalInfo = JSON.stringify({
        wins: +team?.wins,
        losses: +team?.losses,
      });
      const updatedInfo = JSON.stringify({
        wins: +info.wins,
        losses: +info.losses,
      });

      if (originalInfo === updatedInfo) {
        // alert("Podaci su isti!");
      } else {
        handleUpdateGroup(index, info);
      }
      return;
    }

    setEditing(true);
  };

  const handleCancelClick = () => {
    setEditing(false);
    setInfo({
      wins: +team?.wins,
      losses: +team?.losses,
    });
  };

  const handleChange = (e: any) => {
    setInfo({
      ...info,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <tr>
      <td>{index}</td>
      <td>
        {team?.player1.firstName + " " + team?.player1.lastName},{" "}
        {team?.player2.firstName + " " + team?.player2.lastName}
      </td>
      <td>
        {editing ? (
          <input
            type="number"
            name="wins"
            onChange={handleChange}
            value={info?.wins}
          />
        ) : (
          team?.wins
        )}
      </td>
      <td>
        {editing ? (
          <input
            type="number"
            name="losses"
            onChange={handleChange}
            value={info?.losses}
          />
        ) : (
          team?.losses
        )}
      </td>
      <td className={editing ? "ctas" : ""}>
        <Button onClick={handleClick} type={editing ? "primary" : "action"}>
          {editing ? <IoSave /> : <IoPencilSharp />}
        </Button>
        {editing && (
          <Button type="danger" onClick={handleCancelClick}>
            <IoCloseSharp />
          </Button>
        )}
      </td>
    </tr>
  );
}

function Matches({ matches, tournament }: { matches: any; tournament: any }) {
  if (!matches) return null;
  return Object.keys(matches)?.map?.((n, i) => (
    // @ts-ignore
    <TournamentCard key={i} id={n} {...matches[n]} tournament={tournament} />
  ));
}

// ----------------------------------------------------------------
const group = [
  {
    teamId: 0,
    first: "Ime Prezime",
    second: "Ime Prezime",
    wins: 1,
    losses: 2,
  },
  {
    teamId: 1,
    first: "Ime Prezime",
    second: "Ime Prezime",
    wins: 3,
    losses: 2,
  },
  {
    teamId: 2,
    first: "Ime Prezime",
    second: "Ime Prezime",
    wins: 1,
    losses: 5,
  },
  {
    teamId: 3,
    first: "Ime Prezime",
    second: "Ime Prezime",
    wins: 5,
    losses: 2,
  },
];
