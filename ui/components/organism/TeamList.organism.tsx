"use client";

import "@/ui/styles/pages/profile.page.scss";
import "@/ui/styles/pages/tournament.page.scss";

import { TeamType } from "@/interfaces/tournaments";
import { Team } from "./Team.organism";

export function TeamList({
  teams,
  handleEdit,
  deleteTeam,
}: {
  teams: { [key: string]: TeamType } | null;
  deleteTeam: (teamId: string) => void;
  handleEdit: (teamId: string, data: TeamType) => void;
}) {
  if (!teams) return <div>Nema timova</div>;
  return Object.keys(teams).map((key, i) => (
    <Team
      key={i}
      id={key}
      player1={teams[key].player1}
      player2={teams[key].player2}
      deleteTeam={deleteTeam}
      handleEdit={handleEdit}
    />
  ));
}
