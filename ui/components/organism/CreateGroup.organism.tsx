"use client";

import useSingleTournament from "@/ui/hooks/useSingleTournament.hook";
import { useEffect, useRef, useState } from "react";
import "@/ui/styles/pages/profile.page.scss";
import "@/ui/styles/pages/tournament.page.scss";
import { AnimatePresence } from "framer-motion";
import { IoAddCircleOutline, IoChevronBack } from "react-icons/io5";
import Button from "@/ui/components/atoms/Button.atom";
import SelectInput from "@/ui/components/moleculs/Select.molecul";
import Link from "next/link";
import InputField from "@/ui/components/atoms/InputField.atom";
import { TeamList } from "@/ui/components/organism/Teams.organism";
import { GroupList } from "@/ui/components/organism/Groups.organism";
import Tabs from "@/ui/components/moleculs/Tabs.molecul";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { GroupPhaseEnum } from "@/interfaces/tournaments";
import { isNull } from "util";
import { useAddMatch } from "@/infrastructure/mutations/matches";
import { getRSCModuleInformation } from "next/dist/build/analysis/get-page-static-info";

const CreateGroup = ({ tournamentId }: { tournamentId: string }) => {
  const { handleAddGroup, group, setGroup, teams, phase, groups, tournament } =
    useSingleTournament({
      id: tournamentId,
    });

  const [type, setType] = useState("group");

  const [match, setMatch] = useState({
    guest: null,
    host: null,
    goldenPoint: false,
    group: "",
    superTieBreak: true,
    type: 0,

    // double: true,
  });

  const { mutate: addMatch } = useAddMatch();

  function handleAddMatch(e: any) {
    e.preventDefault();
    const payload = {
      matchId: Math.floor(Math.random() * 100),

      title: `${tournament.title} - ${match.group}`,
      startTime: new Date(),
      status: {
        id: 12,
        status: "idle",
      },
      superTieBreak: match.superTieBreak,
      goldenPoint: match.goldenPoint,
      type: match.type,
      players: {
        host: match.host,
        guest: match.guest,
      },
      score: {
        currentSet: [0, 0],
        sets: [
          {
            [0]: 0,
            [1]: 0,
          },
        ],
        tiebreak: [0, 0],
      },
      winner: null,
    };

    const tournamentInfo = {
      tournamentId,
      groupId: match.group,
      phase: phase,
    };
    addMatch({ ...payload, tournament: tournamentInfo });
  }

  return (
    <div>
      <div className="group-btn-header">
        <button
          onClick={() => setType("group")}
          className={`group-btn  ${type === "group" ? " active" : ""}`}
        >
          Grupa
        </button>
        <button
          onClick={() => setType("match")}
          className={`group-btn  ${type === "match" ? " active" : ""}`}
        >
          Meč
        </button>
      </div>
      {type === "group" ? (
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
                selectOptions={Object.keys?.(teams)?.map?.((el) => ({
                  id: el,

                  name:
                    teams[el].player1.firstName +
                    " " +
                    teams[el].player1.lastName +
                    ", " +
                    teams[el].player2.firstName +
                    " " +
                    teams[el].player2.lastName,
                }))}
                handleChange={(val: string) => {
                  const tmpTeams = [...group.teams];
                  tmpTeams[0] = {
                    player1: teams[val]?.player1,
                    player2: teams[val]?.player2,
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
                    ? `${group.teams?.[0]?.player1.firstName} ${group.teams?.[0]?.player1.lastName} ${group.teams?.[0]?.player2.firstName} ${group.teams?.[0]?.player2.lastName}`
                    : "Izaberite igraca"
                }
              />
            </div>
            <div className="input-field">
              <label className="input-field__title">Tim 2</label>

              <SelectInput
                selectOptions={Object.keys(teams).map((el) => ({
                  id: el,

                  name:
                    teams[el].player1.firstName +
                    " " +
                    teams[el].player1.lastName +
                    ", " +
                    teams[el].player2.firstName +
                    " " +
                    teams[el].player2.lastName,
                }))}
                handleChange={(val: string) => {
                  const tmpTeams = [...group.teams];
                  tmpTeams[1] = {
                    player1: teams[val]?.player1,
                    player2: teams[val]?.player2,
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
                    ? `${group.teams?.[1]?.player1.firstName} ${group.teams?.[1]?.player1.lastName} ${group.teams?.[1]?.player2.firstName} ${group.teams?.[1]?.player2.lastName}`
                    : "Izaberite igraca"
                }
              />
            </div>
            <div className="input-field">
              <label className="input-field__title">Tim 3</label>

              <SelectInput
                selectOptions={Object.keys(teams).map((el) => ({
                  id: el,

                  name:
                    teams[el].player1.firstName +
                    " " +
                    teams[el].player1.lastName +
                    ", " +
                    teams[el].player2.firstName +
                    " " +
                    teams[el].player2.lastName,
                }))}
                handleChange={(val: string) => {
                  const tmpTeams = [...group.teams];
                  tmpTeams[2] = {
                    player1: teams[val]?.player1,
                    player2: teams[val]?.player2,
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
                    ? `${group.teams?.[2]?.player1.firstName} ${group.teams?.[2]?.player1.lastName} ${group.teams?.[2]?.player2.firstName} ${group.teams?.[2]?.player2.lastName}`
                    : "Izaberite igraca"
                }
              />
            </div>
            <div className="input-field" style={{ marginBottom: "auto" }}>
              <label className="input-field__title">Tim 4</label>

              <SelectInput
                selectOptions={Object.keys(teams).map((el) => ({
                  id: el,

                  name:
                    teams[el].player1.firstName +
                    " " +
                    teams[el].player1.lastName +
                    ", " +
                    teams[el].player2.firstName +
                    " " +
                    teams[el].player2.lastName,
                }))}
                handleChange={(val: string) => {
                  const tmpTeams = [...group.teams];
                  tmpTeams[3] = {
                    player1: teams[val]?.player1,
                    player2: teams[val]?.player2,
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
                selectOptions={Object.keys(teams).map((el) => ({
                  id: el,

                  name:
                    teams[el].player1.firstName +
                    " " +
                    teams[el].player1.lastName +
                    ", " +
                    teams[el].player2.firstName +
                    " " +
                    teams[el].player2.lastName,
                }))}
                handleChange={(val: string) => {
                  const tmpTeams = [...group.teams];
                  tmpTeams[4] = {
                    player1: teams[val]?.player1,
                    player2: teams[val]?.player2,
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
                  setGroup((prev: any) => ({
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
                  setGroup((prev: any) => ({
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
                  setGroup((prev: any) => ({
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
      ) : (
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
                selectOptions={Object.keys?.(groups)?.map?.((el, i) => ({
                  id: el,
                  name: el,
                }))}
                handleChange={(val: string) => {
                  setMatch({
                    ...match,
                    group: val,
                    superTieBreak: groups[val].superTieBreak ?? true,
                    type: groups[val].type ?? 0,
                  });
                }}
                defaultSelected={match.group ? match.group : "Izaberite grupu"}
              />
            </div>

            <div className="input-field">
              <label className="input-field__title">Tim 1</label>
              <SelectInput
                selectOptions={
                  match.group
                    ? groups[match.group]?.teams?.map?.((el: any) => ({
                        id: el.teamId,

                        name:
                          el?.player1.firstName +
                          " " +
                          el?.player1.lastName +
                          ", " +
                          el?.player2.firstName +
                          " " +
                          el?.player2.lastName,
                      }))
                    : Object.keys?.(teams)?.map?.((el) => ({
                        id: el,

                        name:
                          teams[el].player1.firstName +
                          " " +
                          teams[el].player1.lastName +
                          ", " +
                          teams[el].player2.firstName +
                          " " +
                          teams[el].player2.lastName,
                      }))
                }
                handleChange={(val: string) => {
                  setMatch({
                    ...match,
                    //@ts-ignore
                    host: {
                      teamId: val,
                      player1: teams[val]?.player1,
                      player2: teams[val]?.player2,
                    },
                  });
                }}
                defaultSelected={
                  match?.host
                    ? //@ts-ignore
                      `${match.host.player1.firstName} ${match.host.player1.lastName} ${match.host.player2.firstName} ${match.host.player2.lastName}`
                    : "Izaberite igraca"
                }
              />
            </div>
            <div className="input-field">
              <label className="input-field__title">Tim 2</label>

              <SelectInput
                selectOptions={
                  match.group
                    ? groups[match.group]?.teams?.map?.((el: any) => ({
                        id: el.teamId,

                        name:
                          el?.player1.firstName +
                          " " +
                          el?.player1.lastName +
                          ", " +
                          el?.player2.firstName +
                          " " +
                          el?.player2.lastName,
                      }))
                    : Object.keys?.(teams)?.map?.((el) => ({
                        id: el,

                        name:
                          teams[el].player1.firstName +
                          " " +
                          teams[el].player1.lastName +
                          ", " +
                          teams[el].player2.firstName +
                          " " +
                          teams[el].player2.lastName,
                      }))
                }
                handleChange={(val: string) => {
                  setMatch({
                    ...match,
                    //@ts-ignore

                    guest: {
                      teamId: val,
                      player1: teams[val]?.player1,
                      player2: teams[val]?.player2,
                    },
                  });
                }}
                defaultSelected={
                  match.guest
                    ? //@ts-ignore

                      `${match.guest.player1.firstName} ${match.guest.player1.lastName} ${match.guest.player2.firstName} ${match.guest.player2.lastName}`
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
                  setMatch((prev: any) => ({
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
                  setMatch((prev: any) => ({
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
                  setMatch((prev: any) => ({
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
      )}
    </div>
  );
};

export default CreateGroup;
