"use client";

import useTournaments from "@/ui/hooks/useTournaments";
import TournamentCard from "../moleculs/TournamentCard.molecul";

import "@/ui/styles/organism/tournaments.organism.scss";

export default function Tournamets() {
  const { tournaments } = useTournaments();

  return (
    <div className="tournaments">
      {tournaments?.map((n) => (
        <TournamentCard {...n} />
      ))}
    </div>
  );
}
