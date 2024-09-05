"use client";

import useSingleTournament from "@/ui/hooks/useSingleTournament.hook";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { useAddMatch } from "@/infrastructure/mutations/matches";

import "@/ui/styles/pages/profile.page.scss";
import "@/ui/styles/pages/tournament.page.scss";

import { IoAddCircleOutline } from "react-icons/io5";
import Button from "@/ui/components/atoms/Button.atom";
import SelectInput from "@/ui/components/moleculs/Select.molecul";
import InputField from "@/ui/components/atoms/InputField.atom";
import Tabs from "@/ui/components/moleculs/Tabs.molecul";

import {
  CreateGroupType,
  ObjectType,
  TeamType,
} from "@/interfaces/tournaments";

const CreateGroupForm = ({
  handleAddGroup,
  group,
  setGroup,
  teams,
}: {
  handleAddGroup: (e: React.SyntheticEvent<HTMLFormElement>) => void;
  group: CreateGroupType;
  setGroup: Dispatch<SetStateAction<CreateGroupType>>;
  teams: ObjectType<TeamType> | null;
}) => {
  return (
    <form
      onSubmit={handleAddGroup}
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
          Dodaj novu grupu
        </h2>
        <div className="input-field">
          <label className="input-field__title">Tim 1</label>
          <SelectInput
            selectOptions={
              teams
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
              const tmpTeams = [...group.teams];
              if (teams?.[val]?.player1 && teams?.[val]?.player2)
                tmpTeams[0] = {
                  player1: teams?.[val]?.player1,
                  player2: teams?.[val]?.player2,
                  wins: 0,
                  losses: 0,
                  teamId: val,
                };

              setGroup({
                ...group,
                teams: tmpTeams,
              });
            }}
            defaultSelected={
              group.teams?.[0]
                ? `${group.teams?.[0]?.player1.firstName} ${group.teams?.[0]?.player1.lastName} ${group.teams?.[0]?.player2?.firstName} ${group.teams?.[0]?.player2?.lastName}`
                : "Izaberite igraca"
            }
            required
          />
        </div>
        <div className="input-field">
          <label className="input-field__title">Tim 2</label>

          <SelectInput
            selectOptions={
              teams
                ? Object.keys(teams).map((el) => ({
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
              const tmpTeams = [...group.teams];
              if (teams?.[val]?.player1 && teams?.[val]?.player2)
                tmpTeams[1] = {
                  player1: teams?.[val]?.player1,
                  player2: teams?.[val]?.player2,
                  wins: 0,
                  losses: 0,
                  teamId: val,
                };

              setGroup({
                ...group,
                teams: tmpTeams,
              });
            }}
            defaultSelected={
              group.teams?.[1]
                ? `${group.teams?.[1]?.player1.firstName} ${group.teams?.[1]?.player1.lastName} ${group.teams?.[1]?.player2?.firstName} ${group.teams?.[1]?.player2?.lastName}`
                : "Izaberite igraca"
            }
          />
        </div>
        <div className="input-field">
          <label className="input-field__title">Tim 3</label>

          <SelectInput
            selectOptions={
              teams
                ? Object.keys(teams).map((el) => ({
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
              const tmpTeams = [...group.teams];
              if (teams?.[val]?.player1 && teams?.[val]?.player2)
                tmpTeams[2] = {
                  player1: teams?.[val]?.player1,
                  player2: teams?.[val]?.player2,
                  wins: 0,
                  losses: 0,
                  teamId: val,
                };

              setGroup({
                ...group,
                teams: tmpTeams,
              });
            }}
            defaultSelected={
              group.teams?.[2]
                ? `${group.teams?.[2]?.player1.firstName} ${group.teams?.[2]?.player1.lastName} ${group.teams?.[2]?.player2?.firstName} ${group.teams?.[2]?.player2?.lastName}`
                : "Izaberite igraca"
            }
          />
        </div>
        <div className="input-field" style={{ marginBottom: "auto" }}>
          <label className="input-field__title">Tim 4</label>

          <SelectInput
            selectOptions={
              teams
                ? Object.keys(teams).map((el) => ({
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
              const tmpTeams = [...group.teams];
              if (teams?.[val]?.player1 && teams?.[val]?.player2)
                tmpTeams[3] = {
                  player1: teams?.[val]?.player1,
                  player2: teams?.[val]?.player2,
                  wins: 0,
                  losses: 0,
                  teamId: val,
                };

              setGroup({
                ...group,
                teams: tmpTeams,
              });
            }}
            defaultSelected={
              group.teams?.[3]
                ? `${group.teams?.[3]?.player1?.firstName} ${group.teams?.[3]?.player1?.lastName} ${group.teams?.[3]?.player2?.firstName} ${group.teams?.[3]?.player2?.lastName}`
                : "Izaberite igraca"
            }
          />
        </div>

        <div className="input-field" style={{ marginBottom: "auto" }}>
          <label className="input-field__title">Tim 5</label>

          <SelectInput
            selectOptions={
              teams
                ? Object.keys(teams).map((el) => ({
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
              const tmpTeams = [...group.teams];
              if (teams?.[val]?.player1 && teams?.[val]?.player2)
                tmpTeams[4] = {
                  player1: teams?.[val]?.player1,
                  player2: teams?.[val]?.player2,
                  wins: 0,
                  losses: 0,
                  teamId: val,
                };

              setGroup({
                ...group,
                teams: tmpTeams,
              });
            }}
            defaultSelected={
              group.teams?.[4]
                ? `${group.teams?.[4]?.player1?.firstName} ${group.teams?.[4]?.player1?.lastName} ${group.teams?.[4]?.player2?.firstName} ${group.teams?.[4]?.player2?.lastName}`
                : "Izaberite igraca"
            }
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
              setGroup((prev: CreateGroupType) => ({
                ...prev,
                type: +e.target.value,
              }))
            }
            title="Izaberi tip turnira"
            name="type"
            type="select"
            selected={group?.type}
          />

          <InputField
            onChange={() =>
              setGroup((prev: CreateGroupType) => ({
                ...prev,
                superTieBreak: !prev.superTieBreak,
              }))
            }
            title="Super Tie Break"
            value={group.superTieBreak}
            name="isSuperTieBreak"
            className={"row"}
            type="switch"
          />

          <InputField
            onChange={() =>
              setGroup((prev: CreateGroupType) => ({
                ...prev,
                goldenPoint: !prev.goldenPoint,
              }))
            }
            title="Zlatni poen"
            value={group?.goldenPoint}
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
          dodaj grupu <IoAddCircleOutline />
        </Button>
      </section>
    </form>
  );
};

export default CreateGroupForm;
