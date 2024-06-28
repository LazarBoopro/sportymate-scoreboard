import Button from "@/ui/components/atoms/Button.atom";

import "@/ui/styles/moleculs/team.molecul.scss";

type PlayerType = {
  firstName: string;
  lastName: string;
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
  return (
    <div className="match__section right">
      <div className="players">
        {players?.map((n, i: number) => (
          <p key={i}>{`${n.firstName}  ${n.lastName}`}</p>
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
