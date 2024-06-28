import Tournamets from "@/ui/components/organism/Tournaments.organism";
import TournamentForm from "@/ui/components/organism/TournamentForm.organism";

import "@/ui/styles/pages/profile.page.scss";

export default function Profile() {
  return (
    <main className="main">
      <Tournamets />
      <TournamentForm />
    </main>
  );
}
