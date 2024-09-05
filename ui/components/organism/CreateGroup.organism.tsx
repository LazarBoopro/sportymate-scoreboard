"use client";

import useSingleTournament from "@/ui/hooks/useSingleTournament.hook";
import { useState } from "react";
import { useAddMatch } from "@/infrastructure/mutations/matches";

import "@/ui/styles/pages/profile.page.scss";
import "@/ui/styles/pages/tournament.page.scss";

import { MatchTypeEnum } from "@/interfaces/enums";
import { TeamType } from "@/interfaces/tournaments";

import CreateGroupForm from "../moleculs/CreateGroupForm.molecul";
import CreateMatchForm from "../moleculs/CreateMatchForm.molecul";
import dayjs from "dayjs";
import { CreateGroupMatchType, MatchType } from "@/interfaces/matches";

const CreateGroup = ({ tournamentId }: { tournamentId: string }) => {
  const { handleAddGroup, group, setGroup, teams, phase, groups, tournament } =
    useSingleTournament({
      id: tournamentId,
    });

  const [type, setType] = useState("group");

  const [match, setMatch] = useState<CreateGroupMatchType>({
    guest: null,
    host: null,
    goldenPoint: false,
    group: "",
    superTieBreak: true,
    type: 0,

    // double: true,
  });

  const { mutate: addMatch } = useAddMatch();

  function handleAddMatch(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("ADD MATCH");
    if (!match.host || !match.guest) {
      alert("Morate izabrati igrace");
      return;
    }
    const payload: MatchType = {
      matchId: `${Math.floor(Math.random() * 100)}`,
      title: `${tournament?.title} - ${match.group}`,
      startTime: dayjs().format("YYYY-MM-DD HH:mm"),
      status: {
        id: 12,
        status: "idle",
      },
      superTieBreak: match.superTieBreak,
      goldenPoint: match.goldenPoint,
      type: match.type,
      players: {
        host: match.host,
        guest: match.guest,
      },
      score: {
        currentSet: [0, 0],
        sets: [[0, 0]],
        tiebreak: [0, 0],
      },
      winner: null,
    };

    const tournamentInfo = {
      tournamentId,
      groupId: match.group,
      phase: phase,
    };
    addMatch({ ...payload, tournament: tournamentInfo });
  }

  return (
    <div>
      <div className="group-btn-header">
        <button
          onClick={() => setType("group")}
          className={`group-btn  ${type === "group" ? " active" : ""}`}
        >
          Grupa
        </button>
        <button
          onClick={() => setType("match")}
          className={`group-btn  ${type === "match" ? " active" : ""}`}
        >
          Meč
        </button>
      </div>
      {type === "group" ? (
        <CreateGroupForm
          handleAddGroup={handleAddGroup}
          teams={teams}
          group={group}
          setGroup={setGroup}
        />
      ) : (
        <CreateMatchForm
          match={match}
          setMatch={setMatch}
          handleAddMatch={handleAddMatch}
          groups={groups}
          teams={teams}
        />
      )}
    </div>
  );
};

export default CreateGroup;
