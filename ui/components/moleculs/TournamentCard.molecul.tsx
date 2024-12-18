import Link from "next/link";
import dayjs from "dayjs";

import Button from "@/ui/components/atoms/Button.atom";

import { MatchType } from "@/interfaces/matches";

import { useDeleteMatch } from "@/infrastructure/mutations/matches";

import { checkStatusMessage } from "@/lib/helpers/messages";

import {
  IoTrashOutline,
  IoSettingsOutline,
  IoTvOutline,
} from "react-icons/io5";

import "@/ui/styles/moleculs/tourtnament.molecul.scss";
import { MATCH_TYPES } from "@/lib/constants/match";
import { scores } from "@/lib/helpers/score";
import { TournamentQueryParams } from "@/interfaces/tournaments";

type TournamentType = MatchType & {
  id: string;
  tournament?: TournamentQueryParams;
};

export default function TournamentCard({
  title,
  startTime,
  status,
  id,
  players,
  type,
  score,
  superTieBreak,
  tournament,
}: TournamentType) {
  const { mutate: deleteTournament } = useDeleteMatch();

  return (
    <div className="tournament">
      <div className="tournament__header">
        <p className="title">
          {title}{" "}
          <span className="type">{`${MATCH_TYPES[type]?.title} ${
            superTieBreak && `+ Super TieBreak`
          }`}</span>
        </p>

        <p className="subtitle">
          <span
            className={`status ${
              status?.status.toLowerCase().replace(" ", "") ?? "idle"
            }`}
          >
            {checkStatusMessage(status?.status) ?? "idle"}
          </span>
          {dayjs(startTime).format("DD.MM.YYYY / HH:mm")}
        </p>
      </div>

      <div className="tournament__body">
        <div className="team">
          <p>{` ${players.host.player1?.firstName?.[0]}. ${players.host.player1?.lastName}`}</p>
          <p>{` ${players.host.player2?.firstName?.[0]}. ${players.host.player2?.lastName}`}</p>
        </div>

        <div className="scores">
          <div className="scores__top">
            <p>{score?.currentSet[0] ? scores[score.currentSet[0]] : 0}</p>
            <p>:</p>
            <p>{score?.currentSet[1] ? scores[score.currentSet[1]] : 0}</p>
          </div>
          <div className="scores__bottom">
            {score?.sets?.map?.((set, i) => (
              <p key={i}>
                {`${set[0]}:${set[1]} ${
                  i !== score?.sets.length - 1 ? "/" : ""
                }`}
              </p>
            ))}
          </div>
        </div>

        <div className="team">
          <p>{` ${players.guest.player1?.firstName?.[0]}. ${players.guest.player1?.lastName}`}</p>
          <p>{` ${players.guest.player2?.firstName?.[0]}. ${players.guest.player2?.lastName}`}</p>
        </div>
      </div>

      <div className="tournament__ctas">
        <Link
          href={{
            pathname: `/match/${id}`,
            query: { watch: "true", ...tournament },
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
            query: { ...tournament },
          }}
        >
          <Button type="action">
            Sudi
            <IoSettingsOutline />
          </Button>
        </Link>

        <Link href={"#"}>
          <Button
            type="danger"
            onClick={() => deleteTournament({ id, tournament })}
          >
            <IoTrashOutline />
          </Button>
        </Link>
      </div>
    </div>
  );
}
