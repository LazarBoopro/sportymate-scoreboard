import { TournamentType } from "@/interfaces/tournaments";

import "@/ui/styles/moleculs/tourtnament.molecul.scss";
import Button from "../atoms/Button.atom";

import { IoTrashOutline, IoPencilOutline } from "react-icons/io5";

export default function TournamentCard({
  title,
  startTime,
  status,
}: TournamentType) {
  return (
    <div className="tournament">
      <div className="tournament__heading">
        <p className="title">{title}</p>
        <p className="subtitle">
          <span className={`status ${status}`}>{status}</span>
          {startTime}
        </p>
      </div>
      <div className="tournament__ctas">
        <Button type="danger">
          <IoTrashOutline />
        </Button>
        <Button type="primary">
          <IoPencilOutline />
        </Button>
      </div>
    </div>
  );
}
