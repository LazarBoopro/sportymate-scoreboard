"use client";

import Tournamets from "@/ui/components/organism/Tournaments.organism";
import TournamentForm from "@/ui/components/organism/TournamentForm.organism";

import "@/ui/styles/pages/profile.page.scss";
import { useContext } from "react";
import Context from "@/ui/providers/NavbarContext.provider";

export default function Profile() {
  const { screen } = useContext(Context);

  return (
    <main className="main">
      <Tournamets />
      {screen === "matches" && <TournamentForm />}
    </main>
  );
}
