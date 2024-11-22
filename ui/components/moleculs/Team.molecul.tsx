import { useParams } from "next/navigation";
import { useContext, useState } from "react";

import Button from "@/ui/components/atoms/Button.atom";
import Context from "@/ui/providers/NavbarContext.provider";

import { IoTennisball } from "react-icons/io5";

import "@/ui/styles/moleculs/team.molecul.scss";
import { TeamType } from "@/interfaces/tournaments";
import { Switch } from "@/components/ui/switch";
import InputField from "../atoms/InputField.atom";
import useSingleMatch from "@/ui/hooks/useSingleMatch.hook";

export function Team({
  players,
  handleChange,
  team,
  status,
  handleChangeGemPoint,
  handleSetWinner,
}: {
  players?: TeamType;
  handleChange: CallableFunction;
  team: number;
  status: string;
  handleChangeGemPoint: CallableFunction;
  handleSetWinner: CallableFunction;
}) {
  const { setServing } = useContext(Context);
  const { id } = useParams();

  const [finish, setFinish] = useState(false);

  const { match } = useContext(Context);

  const host = match?.winner === "host" && team === 0;
  const guest = match?.winner === "guest" && team === 1;

  const s = status?.toLocaleLowerCase();

  const handleClick = (player: number) => {
    setServing({
      gameId: id,
      playerId: player,
      team: team === 0 ? "host" : "guest",
    });
  };

  function handleWinner() {
    if (host || guest) {
      handleSetWinner(null, false);
      return;
    }

    const winner = team === 0 ? "host" : "guest";
    handleSetWinner(winner, finish);
  }

  return (
    <div className="match__section right">
      <div className="players">
        {/* {players?.map((n, i: number) => (
                    <p
                        key={i}
                        className={n?.serving ? "serving" : "inactive"}
                        onClick={() => handleClick(i)}
                    >
                        {`${n.firstName}  ${n.lastName}`}
                        <IoTennisball />
                    </p>
                ))} */}

        <p
          className={players?.player1?.serving ? "serving" : "inactive"}
          onClick={() => handleClick(0)}
        >
          {`${players?.player1.firstName}  ${players?.player1.lastName}`}
          <IoTennisball />
        </p>
        {players?.player2 && (
          <p
            className={players?.player2?.serving ? "serving" : "inactive"}
            onClick={() => handleClick(1)}
          >
            {`${players?.player2.firstName}  ${players?.player2.lastName}`}
            <IoTennisball />
          </p>
        )}
      </div>

      <div className="actions">
        <div className="action">
          <p>Poeni</p>
          <div className="ctas">
            <Button
              onClick={() =>
                handleChange && s !== "completed"
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
                handleChange && s !== "completed"
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
            <Button onClick={() => handleChangeGemPoint(team, "plus")}>
              +
            </Button>
            <Button
              type="danger"
              onClick={() => handleChangeGemPoint(team, "minus")}
            >
              -
            </Button>
          </div>
        </div>
      </div>
      <div className="options">
        <div className="options__option">
          <Button
            // onClick={() =>
            //   handleSetWinner(team === 0 ? "host" : "guest", finish)
            // }
            type="action"
            onClick={handleWinner}
          >
            Oznaci pobednika
          </Button>
          <InputField
            value={finish}
            onChange={() => setFinish((prev) => !prev)}
            name="finishMatch"
            title="Završi meč"
            type="switch"
          />
        </div>
      </div>
    </div>
  );
}
