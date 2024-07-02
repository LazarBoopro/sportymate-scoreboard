import { useParams } from "next/navigation";
import { useContext } from "react";

import Button from "@/ui/components/atoms/Button.atom";
import Context from "@/ui/providers/NavbarContext.provider";

import { IoTennisball } from "react-icons/io5";

import "@/ui/styles/moleculs/team.molecul.scss";

type PlayerType = {
  firstName: string;
  lastName: string;
  serving?: boolean;
};

export function Team({
  players,
  handleChange,
  team,
}: {
  players: PlayerType[] | undefined;
  handleChange?: CallableFunction;
  team: number;
}) {
  const { setServing } = useContext(Context);
  const { id } = useParams();

  const handleClick = (player: number) => {
    setServing({
      gameId: id,
      playerId: player,
      team: team === 0 ? "host" : "guest",
    });
  };

  return (
    <div className="match__section right">
      <div className="players">
        {players?.map((n, i: number) => (
          <p
            key={i}
            className={n?.serving ? "serving" : "inactive"}
            onClick={() => handleClick(i)}
          >
            {`${n.firstName}  ${n.lastName}`}
            <IoTennisball />
          </p>
        ))}
      </div>

      <div className="actions">
        <div className="action">
          <p>Poeni</p>
          <div className="ctas">
            <Button
              onClick={() =>
                handleChange
                  ? handleChange({
                      team,
                      path: "/score/currentSet",
                      action: "plus",
                    })
                  : null
              }
            >
              +
            </Button>
            <Button
              onClick={() =>
                handleChange
                  ? handleChange({
                      team,
                      path: `/score/currentSet`,
                      action: "minus",
                    })
                  : null
              }
              type="danger"
            >
              -
            </Button>
          </div>
        </div>
        <div className="action">
          <p>Gem</p>
          <div className="ctas">
            <Button>+</Button>
            <Button type="danger">-</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
