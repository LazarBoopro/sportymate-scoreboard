"use client";

import Button from "@/ui/components/atoms/Button.atom";
import TournamentCard from "@/ui/components/moleculs/TournamentCard.molecul";
import useMatches from "@/ui/hooks/useMatches";
import "@/ui/styles/pages/group.page.scss";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  IoBackspaceSharp,
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
        <h1>Grupa {params.group.toUpperCase()}</h1>
      </div>

      <div className="table">
        <h2>Tabela</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Igraci</th>
              <th>Br. pobeda</th>
              <th>Br. Odigranih</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {group?.map((team, i) => (
              <GroupRow key={i} team={team} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="matches">
        <h2>Mecevi</h2>
        <div className="matches-list">
          <Matches />
        </div>
      </div>
    </section>
  );
}

function GroupRow({ team }: any) {
  const [info, setInfo] = useState({
    wins: team?.wins,
    losses: team?.losses,
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
        alert("Podaci su isti!");
      } else {
        console.log("Usao, promenjeno!");
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
      <td>{team?.teamId}</td>
      <td>
        {team?.first}, {team?.second}
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

function Matches() {
  // TODO: THIS IS TEMPORARY, CHANGE LATER WITH ACTUAL DATA FOR GROUP
  const { tournaments } = useMatches();

  return tournaments?.map((n, i) => <TournamentCard key={i} {...n} />);
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
