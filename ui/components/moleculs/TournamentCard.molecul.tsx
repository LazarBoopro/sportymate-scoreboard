import Link from "next/link";
import dayjs from "dayjs";

import Button from "@/ui/components/atoms/Button.atom";

import { TournamentType } from "@/interfaces/tournaments";

import { useDeleteTournament } from "@/infrastructure/mutations/tournaments";

import {
  IoTrashOutline,
  IoPlayOutline,
  IoSettingsOutline,
  IoTvOutline,
} from "react-icons/io5";

import "@/ui/styles/moleculs/tourtnament.molecul.scss";

export default function TournamentCard({
  title,
  startTime,
  status,
  id,
}: TournamentType) {
  const { mutate: deleteTournament } = useDeleteTournament();

  return (
    <div className="tournament">
      <div className="tournament__header">
        <p className="title">{title}</p>
        <p className="subtitle">
          <span className={`status ${status.status ?? "idle"}`}>
            {status.status ?? "idle"}
          </span>
          {dayjs(startTime).format("DD.MM.YYYY / HH:mm")}
        </p>
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
            {/* <IoPlayOutline /> */}
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
