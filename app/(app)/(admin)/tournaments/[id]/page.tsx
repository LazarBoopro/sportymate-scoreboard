"use client";

import Link from "next/link";

import { usePathname, useSearchParams } from "next/navigation";
import useSingleTournament from "@/ui/hooks/useSingleTournament.hook";
import { Suspense, useEffect, useRef, useState, MouseEvent } from "react";

import "@/ui/styles/pages/profile.page.scss";
import "@/ui/styles/pages/tournament.page.scss";

import { AnimatePresence } from "framer-motion";
import { IoAddCircleOutline, IoChevronBack } from "react-icons/io5";

import Button from "@/ui/components/atoms/Button.atom";
import InputField from "@/ui/components/atoms/InputField.atom";
import { TeamList } from "@/ui/components/organism/TeamList.organism";
import { GroupList } from "@/ui/components/organism/Groups.organism";
import CreateGroup from "@/ui/components/organism/CreateGroup.organism";
import { phases } from "@/helpers/helpers";

export default function SingleTournament({
  params,
}: {
  params: { id: string };
}) {
  const {
    tournament,
    groups,
    handleAddTeam,
    handleOnChangeTeam,
    team,
    teams,
    handleDeleteTeam,
    handleUpdateTeam,
    handleDeleteGroup,
  } = useSingleTournament({ id: params.id });

  const teamsButtonRef = useRef<HTMLButtonElement | null>(null);
  const groupButtonRef = useRef<HTMLButtonElement | null>(null);

  const [screen, setScreen] = useState<"groups" | "teams">("groups");
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
  });

  const pathname = usePathname();
  const queryParams = useSearchParams();

  const handleMouseClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!(e.target instanceof HTMLButtonElement)) {
      return;
    }

    setPosition({
      left: (e?.target?.offsetLeft || teamsButtonRef?.current?.offsetLeft) ?? 0,
      width:
        (e?.target?.getBoundingClientRect().width ||
          teamsButtonRef?.current?.getBoundingClientRect().width) ??
        0,
    });
    setScreen(e.target.dataset.type as typeof screen);
  };

  useEffect(() => {
    if (screen === "groups") {
      setPosition({
        left: groupButtonRef?.current?.offsetLeft || 0,
        width: groupButtonRef?.current?.getBoundingClientRect().width || 0,
      });
    } else {
      setPosition({
        left: teamsButtonRef?.current?.offsetLeft || 0,
        width: teamsButtonRef?.current?.getBoundingClientRect().width || 0,
      });
    }
  }, [groupButtonRef.current, teamsButtonRef.current, tournament]);

  return (
    <Suspense>
      <main className="main">
        <div className="tournaments" id="tournaments">
          <div className="tournaments__header">
            <div className="header">
              <Link href={"/"} className="back">
                <IoChevronBack />
              </Link>

              <h1>{tournament?.title}</h1>
            </div>
            <div className="screen-switch">
              <button
                ref={groupButtonRef}
                data-type="groups"
                onClick={handleMouseClick}
              >
                Grupe
              </button>
              <button
                ref={teamsButtonRef}
                data-type="teams"
                onClick={handleMouseClick}
              >
                Timovi
              </button>
              <div
                className="cursor"
                style={{
                  ...position,
                }}
              ></div>
            </div>
          </div>

          {screen === "groups" && (
            <div className="phase-switch">
              {phases.map((n, i) => (
                <Link
                  href={{
                    pathname,
                    query: {
                      phase: n.id,
                    },
                  }}
                  key={i}
                  className={
                    n.id === queryParams.get("phase") ? "link active" : "link"
                  }
                >
                  {n.label}
                </Link>
              ))}
            </div>
          )}

          <div className="tournaments__list">
            <AnimatePresence>
              {screen === "groups" ? (
                <GroupList
                  tournamentId={params.id}
                  groups={groups}
                  handleDelete={handleDeleteGroup}
                />
              ) : (
                <TeamList
                  teams={teams}
                  deleteTeam={handleDeleteTeam}
                  handleEdit={handleUpdateTeam}
                />
              )}
            </AnimatePresence>
          </div>
        </div>

        {screen === "groups" ? (
          <CreateGroup tournamentId={params.id} />
        ) : (
          <form
            onSubmit={handleAddTeam}
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
                Dodaj novi tim
              </h2>
              <p>Igrac 1:</p>
              <InputField
                onChange={handleOnChangeTeam}
                title="Ime"
                name="player1.firstName"
                value={team.player1.firstName}
                placeholder="Ime"
                required
              />
              <InputField
                onChange={handleOnChangeTeam}
                title="Prezime"
                name="player1.lastName"
                value={team.player1.lastName}
                placeholder="Prezime"
                required
              />
              <p>Igrac 2:</p>

              <InputField
                onChange={handleOnChangeTeam}
                title="Ime"
                name="player2.firstName"
                value={team.player2?.firstName ?? ""}
                placeholder="Ime"
                required
              />
              <InputField
                onChange={handleOnChangeTeam}
                title="Prezime"
                name="player2.lastName"
                value={team.player2?.lastName ?? ""}
                placeholder="Prezime"
                required
              />

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
                dodaj tim <IoAddCircleOutline />
              </Button>
            </section>
          </form>
        )}
      </main>
    </Suspense>
  );
}
