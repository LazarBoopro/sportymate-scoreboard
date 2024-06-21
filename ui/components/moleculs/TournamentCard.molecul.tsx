import Button from "@/ui/components/atoms/Button.atom";

import { TournamentType } from "@/interfaces/tournaments";

import "@/ui/styles/moleculs/tourtnament.molecul.scss";

import {
  IoTrashOutline,
  IoPencilOutline,
  IoPlayOutline,
  IoChevronBackOutline,
} from "react-icons/io5";
import dayjs from "dayjs";
import { useDeleteTournament } from "@/infrastructure/mutations/tournaments";

export default function TournamentCard({
  title,
  startTime,
  status,
  id,
}: TournamentType) {
  const { mutate: deleteTournament } = useDeleteTournament();

  return (
    <div className="tournament">
      <div className="tournament__heading">
        <p className="title">{title}</p>
        <p className="subtitle">
          <span className={`status ${status}`}>{status}</span>
          {dayjs(startTime).format("DD.MM.YYYY / HH:mm")}
        </p>
      </div>
      <div className="tournament__ctas">
        <Button>
          <IoPlayOutline />
        </Button>
        <Button type="primary">
          <IoPencilOutline />
        </Button>
        <Button type="danger" onClick={() => deleteTournament(id)}>
          <IoTrashOutline />
        </Button>
      </div>
    </div>
  );
}
