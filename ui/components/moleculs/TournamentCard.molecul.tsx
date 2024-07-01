import Link from "next/link";
import dayjs from "dayjs";

import Button from "@/ui/components/atoms/Button.atom";

import { TournamentTypeService } from "@/interfaces/tournaments";

import { useDeleteTournament } from "@/infrastructure/mutations/tournaments";

import {
  IoTrashOutline,
  IoSettingsOutline,
  IoTvOutline,
} from "react-icons/io5";

import "@/ui/styles/moleculs/tourtnament.molecul.scss";

type TournamentType = TournamentTypeService & {
  id: string;
};

export default function TournamentCard({
  title,
  startTime,
  status,
  id,
  players,
  score,
}: TournamentType) {
  const { mutate: deleteTournament } = useDeleteTournament();

  return (
    <div className="tournament">
      <div className="tournament__header">
        <p className="title">{title}</p>
        <p className="subtitle">
          <span
            className={`status ${
              status?.status.toLowerCase().replace(" ", "") ?? "idle"
            }`}
          >
            {status?.status ?? "idle"}
          </span>
          {dayjs(startTime).format("DD.MM.YYYY / HH:mm")}
        </p>
      </div>

      <div className="tournament__body">
        <div className="team">
          {players.host.map((n) => (
            <p>{` ${n.firstName?.[0]}. ${n.lastName}`}</p>
          ))}
        </div>

        <div className="score">
          <p>{score.currentSet[0]}</p>
          <p>:</p>
          <p>{score.currentSet[1]}</p>
        </div>

        <div className="team">
          {players.guest.map((n) => (
            <p>{` ${n.firstName?.[0]}. ${n.lastName}`}</p>
          ))}
        </div>
      </div>

      <div className="tournament__ctas">
        <Link
          href={{
            pathname: `/match/${id}`,
            query: { watch: "true" },
          }}
        >
          <Button>
            Gledaj
            <IoTvOutline />
          </Button>
        </Link>

        <Link
          href={{
            pathname: `/match/${id}`,
          }}
        >
          <Button type="action">
            Sudi
            <IoSettingsOutline />
          </Button>
        </Link>

        <Link href={"#"}>
          <Button type="danger" onClick={() => deleteTournament(id)}>
            <IoTrashOutline />
          </Button>
        </Link>
      </div>
    </div>
  );
}
