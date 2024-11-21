"use client";

import { Dispatch, SetStateAction } from "react";

import "@/ui/styles/pages/profile.page.scss";
import "@/ui/styles/pages/tournament.page.scss";

import { IoAddCircleOutline } from "react-icons/io5";
import Button from "@/ui/components/atoms/Button.atom";
import { Checkbox } from "@/components/ui/checkbox";

import { ObjectType, TeamType } from "@/interfaces/tournaments";

const AddTeamsForm = ({
  handleAddTeams,
  phaseTeams,
  setPhaseTeams,
  teams,
}: {
  handleAddTeams: (e: React.SyntheticEvent<HTMLFormElement>) => void;
  phaseTeams: TeamType[];
  setPhaseTeams: Dispatch<SetStateAction<TeamType[]>>;
  teams: ObjectType<TeamType> | null;
}) => {
  return (
    <form
      onSubmit={handleAddTeams}
      className="tournament-form__form"
      style={{ height: "100%0", padding: "1rem", overflow: "hidden" }}
    >
      <section
        style={{
          maxWidth: "100%",
          height: "100%",
          padding: "0",
        }}
      >
        <h2
          style={{
            fontSize: "clamp(1rem, 10vw, 1.25rem)",
            fontWeight: "800",
          }}
        >
          Dodaj timove
        </h2>

        {teams &&
          Object.keys(teams).map((key: string) => (
            <div
              key={key}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <Checkbox
                name={key}
                id={key}
                onCheckedChange={(checked: boolean) => {
                  if (checked) {
                    setPhaseTeams([
                      ...phaseTeams,
                      { ...teams[key], teamId: key },
                    ]);
                  } else {
                    setPhaseTeams(
                      phaseTeams.filter((team) => team.teamId !== key)
                    );
                  }
                }}
                checked={!!phaseTeams.find((team) => team.teamId === key)}
              />
              <label htmlFor={key}>
                {teams[key].player1.firstName +
                  " " +
                  teams[key].player1.lastName +
                  ", " +
                  teams[key].player2?.firstName +
                  " " +
                  teams[key].player2?.lastName}
              </label>
            </div>
          ))}

        <div
          className="divider"
          style={{
            height: "1px",
            width: "100%",
            borderBottom: "1px solid #ccc",
            marginBottom: "auto",
          }}
        ></div>

        <Button>
          Dodaj timove <IoAddCircleOutline />
        </Button>
      </section>
    </form>
  );
};

export default AddTeamsForm;
