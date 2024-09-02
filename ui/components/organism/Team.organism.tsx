"use client";

import { useState } from "react";
import "@/ui/styles/pages/profile.page.scss";
import "@/ui/styles/pages/tournament.page.scss";
import { IoPencilSharp, IoSaveOutline, IoTrashOutline } from "react-icons/io5";
import Button from "@/ui/components/atoms/Button.atom";

import InputField from "@/ui/components/atoms/InputField.atom";

export function Team({
  id,
  player1,
  player2,
  deleteTeam,
  handleEdit,
}: {
  id: string;
  player1: { firstName: string; lastName: string };
  player2: { firstName: string; lastName: string };
  deleteTeam: (teamId: string) => void;
  handleEdit: (
    teamId: string,
    data: {
      player1: { firstName: string; lastName: string };
      player2: { firstName: string; lastName: string };
    }
  ) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [info, setInfo] = useState({
    player1,
    player2,
  });

  const handleClick = () => {
    if (editing) {
      handleEdit(id, info);

      setEditing(false);

      return;
    }

    setEditing(true);
  };

  const handleChange = (e: any) => {
    const [player, name] = e.target.name.split(".");
    const tmpTeam = { ...info };

    //@ts-ignore
    tmpTeam[player][name] = e.target.value;

    setInfo(tmpTeam);
  };

  return (
    <article className="single-team">
      <div className="details">
        {!editing ? (
          <p>{player1.firstName + " " + player1.lastName}</p>
        ) : (
          <>
            <InputField
              name="player1.firstName"
              onChange={handleChange}
              value={info.player1.firstName}
              placeholder="Ime"
            />

            <InputField
              name="player1.lastName"
              onChange={handleChange}
              placeholder="Prezime"
              value={info.player1.lastName}
            />
          </>
        )}
        {!editing ? (
          <p>{player2.firstName + " " + player2.lastName}</p>
        ) : (
          <>
            <InputField
              name="player2.firstName"
              onChange={handleChange}
              value={info.player2.firstName}
              placeholder="Ime"
            />
            <InputField
              name="player2.lastName"
              onChange={handleChange}
              value={info.player2.lastName}
              placeholder="Prezime"
            />
          </>
        )}
      </div>

      <div className="ctas">
        <Button onClick={handleClick} type={editing ? "primary" : "action"}>
          {editing ? (
            <>
              Sacuvaj <IoSaveOutline />
            </>
          ) : (
            <>
              Izmeni <IoPencilSharp />
            </>
          )}
        </Button>
        <Button type="danger" onClick={() => deleteTeam(id)}>
          Obrisi
          <IoTrashOutline />
        </Button>
      </div>
    </article>
  );
}
