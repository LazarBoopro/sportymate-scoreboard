"use client";

import { useState } from "react";

import { TeamType } from "@/interfaces/tournaments";

import Button from "@/ui/components/atoms/Button.atom";

import { IoCloseSharp, IoPencilSharp, IoSave } from "react-icons/io5";

import "@/ui/styles/pages/group.page.scss";

export function GroupRow({
  team,
  index,
  handleUpdateGroup,
}: {
  team: TeamType;
  index: number;
  handleUpdateGroup: (
    index: number,
    info: { wins: number; losses: number }
  ) => void;
}) {
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
        wins: team?.wins ? +team.wins : 0,
        losses: team?.losses ? +team.losses : 0,
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
      wins: team?.wins ? +team.wins : 0,
      losses: team?.losses ? +team.losses : 0,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        {team?.player2
          ? team?.player2.firstName + " " + team?.player2.lastName
          : ""}
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
