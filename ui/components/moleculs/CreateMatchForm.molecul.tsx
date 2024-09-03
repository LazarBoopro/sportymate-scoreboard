"use client";

import useSingleTournament from "@/ui/hooks/useSingleTournament.hook";
import { Dispatch, SetStateAction, useState } from "react";
import { useAddMatch } from "@/infrastructure/mutations/matches";

import "@/ui/styles/pages/profile.page.scss";
import "@/ui/styles/pages/tournament.page.scss";

import { IoAddCircleOutline } from "react-icons/io5";
import Button from "@/ui/components/atoms/Button.atom";
import SelectInput from "@/ui/components/moleculs/Select.molecul";
import InputField from "@/ui/components/atoms/InputField.atom";
import Tabs from "@/ui/components/moleculs/Tabs.molecul";

import { MatchTypeEnum } from "@/interfaces/enums";
import { GroupType, ObjectType, TeamType } from "@/interfaces/tournaments";
import { CreateGroupMatchType } from "@/interfaces/matches";

const CreateMatchForm = ({
  match,
  setMatch,
  handleAddMatch,
  groups,
  teams,
}: {
  match: CreateGroupMatchType;
  setMatch: Dispatch<SetStateAction<CreateGroupMatchType>>;
  handleAddMatch: (e: React.SyntheticEvent<HTMLFormElement>) => void;
  teams: ObjectType<TeamType> | null;
  groups: ObjectType<GroupType> | null;
}) => {
  return (
    <form
      onSubmit={handleAddMatch}
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
          Dodaj mec
        </h2>
        <div className="input-field">
          <label className="input-field__title">Izaberite grupu</label>
          <SelectInput
            selectOptions={
              groups
                ? Object.keys?.(groups)?.map?.((el, i) => ({
                    id: el,
                    name: el,
                  }))
                : []
            }
            handleChange={(val: string) => {
              setMatch({
                ...match,
                group: val,
                superTieBreak: groups?.[val].superTieBreak ?? true,
                type: groups?.[val].type ?? 0,
              });
            }}
            defaultSelected={match.group ? match.group : "Izaberite grupu"}
            required
          />
        </div>

        <div className="input-field">
          <label className="input-field__title">Tim 1</label>
          <SelectInput
            selectOptions={
              match.group
                ? groups?.[match.group]?.teams?.map?.((el: TeamType) => ({
                    id: el.teamId,

                    name:
                      el?.player1.firstName +
                      " " +
                      el?.player1.lastName +
                      ", " +
                      el?.player2?.firstName +
                      " " +
                      el?.player2?.lastName,
                  }))
                : teams
                ? Object.keys?.(teams)?.map?.((el) => ({
                    id: el,

                    name:
                      teams[el].player1.firstName +
                      " " +
                      teams[el].player1.lastName +
                      ", " +
                      teams[el].player2?.firstName +
                      " " +
                      teams[el].player2?.lastName,
                  }))
                : []
            }
            handleChange={(val: string) => {
              if (teams?.[val]?.player1 && teams[val]?.player2) {
                setMatch({
                  ...match,

                  host: {
                    teamId: val,
                    player1: teams[val].player1,
                    player2: teams[val].player2,
                  },
                });
              }
            }}
            defaultSelected={
              match?.host
                ? `${match.host.player1.firstName} ${match.host.player1.lastName} ${match.host.player2?.firstName} ${match.host.player2?.lastName}`
                : "Izaberite igraca"
            }
            required
          />
        </div>
        <div className="input-field">
          <label className="input-field__title">Tim 2</label>

          <SelectInput
            selectOptions={
              match.group
                ? groups?.[match.group]?.teams?.map?.((el: TeamType) => ({
                    id: el.teamId,

                    name:
                      el?.player1.firstName +
                      " " +
                      el?.player1.lastName +
                      ", " +
                      el?.player2?.firstName +
                      " " +
                      el?.player2?.lastName,
                  }))
                : teams
                ? Object.keys?.(teams)?.map?.((el) => ({
                    id: el,

                    name:
                      teams[el].player1.firstName +
                      " " +
                      teams[el].player1.lastName +
                      ", " +
                      teams[el].player2?.firstName +
                      " " +
                      teams[el].player2?.lastName,
                  }))
                : []
            }
            handleChange={(val: string) => {
              if (teams?.[val]?.player1 && teams[val]?.player2) {
                setMatch({
                  ...match,

                  guest: {
                    teamId: val,
                    player1: teams[val].player1,
                    player2: teams[val].player2,
                  },
                });
              }
            }}
            defaultSelected={
              match.guest
                ? `${match.guest.player1.firstName} ${match.guest.player1.lastName} ${match.guest.player2?.firstName} ${match.guest.player2?.lastName}`
                : "Izaberite igraca"
            }
            required
          />
        </div>

        <div
          className="divider"
          style={{
            height: "1px",
            width: "100%",
            borderBottom: "1px solid #ccc",
          }}
        ></div>

        <section
          style={{
            display: "flex",
            gap: "1rem",
            flexDirection: "column",
          }}
        >
          <Tabs
            onChange={(e) =>
              setMatch((prev: CreateGroupMatchType) => ({
                ...prev,
                type: +e.target.value,
              }))
            }
            title="Izaberi tip turnira"
            name="type"
            type="select"
            selected={match?.type}
          />

          <InputField
            onChange={() =>
              setMatch((prev: CreateGroupMatchType) => ({
                ...prev,
                superTieBreak: !prev.superTieBreak,
              }))
            }
            title="Super Tie Break"
            value={match.superTieBreak}
            name="isSuperTieBreak"
            className={"row"}
            type="switch"
          />

          <InputField
            onChange={() =>
              setMatch((prev: CreateGroupMatchType) => ({
                ...prev,
                goldenPoint: !prev.goldenPoint,
              }))
            }
            title="Zlatni poen"
            value={match?.goldenPoint}
            name="isGoldenPoint"
            className={"row"}
            type="switch"
          />
        </section>

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
          Dodaj mec <IoAddCircleOutline />
        </Button>
      </section>
    </form>
  );
};

export default CreateMatchForm;
