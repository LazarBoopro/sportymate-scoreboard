import Navbar from "@/ui/components/moleculs/Navbar.molecul";
import Tournamets from "@/ui/components/organism/Tournaments.organism";
import TournamentForm from "@/ui/components/organism/TournamentForm.organism";

import "@/ui/styles/pages/profile.page.scss";

export default function Profile() {
  return (
    <>
      <Navbar />
      <div className="wrapper">
        <Tournamets />
        <TournamentForm />
      </div>
    </>
  );
}
