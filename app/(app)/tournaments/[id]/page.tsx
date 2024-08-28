"use client";

import useSingleTournament from "@/ui/hooks/useSingleTournament.hook";
import { useEffect, useRef, useState } from "react";
import "@/ui/styles/pages/profile.page.scss";
import "@/ui/styles/pages/tournament.page.scss";

import { AnimatePresence } from "framer-motion";
import {
  IoAddCircle,
  IoAddCircleOutline,
  IoAddSharp,
  IoTrashBinOutline,
  IoTrashOutline,
} from "react-icons/io5";
import Button from "@/ui/components/atoms/Button.atom";
import InputField from "@/ui/components/atoms/InputField.atom";
import SelectFIeld from "@/ui/components/atoms/SelectField.atom";
import SelectInput from "@/ui/components/moleculs/Select.molecul";
import Link from "next/link";
import Tabs from "@/ui/components/moleculs/Tabs.molecul";

export default function SingleTournament({
  params,
}: {
  params: { id: string };
}) {
  const { tournament } = useSingleTournament({ id: params.id });

  const tournamentButtonRef = useRef<HTMLButtonElement | null>(null);

  const [screen, setScreen] = useState<"matches" | "teams">("matches");
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
  });

  const [settings, setSettings] = useState({
    double: true,
    type: 0,
    superTieBreak: true,
  });

  const [team, setTeam] = useState({
    player1: "",
    player2: "",
  });

  const handleMouseClick = (e: any) => {
    setPosition({
      left: e?.target?.offsetLeft || tournamentButtonRef?.current?.offsetLeft,
      width:
        e?.target?.getBoundingClientRect().width ||
        tournamentButtonRef?.current?.getBoundingClientRect().width,
    });
    setScreen(e.target.dataset.type);
  };

  const handleOnChange = (e: any) => {
    setTeam((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // TODO: Save changes to the tournament
    console.log("Settings updated:", settings);
  };

  useEffect(() => {
    setPosition({
      left: tournamentButtonRef?.current?.offsetLeft || 0,
      width: tournamentButtonRef?.current?.getBoundingClientRect().width || 0,
    });
  }, [tournamentButtonRef.current, tournament]);

  return (
    <main className="main">
      <div className="tournaments" id="tournaments">
        <div className="tournaments__header">
          <div className="screen-switch">
            <button data-type="matches" onClick={handleMouseClick}>
              Grupe
            </button>
            <button data-type="teams" onClick={handleMouseClick}>
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
        <div className="tournaments__list">
          <AnimatePresence>
            {screen === "matches" ? (
              <GroupList tournamentId={params.id} />
            ) : (
              <TeamList />
            )}
          </AnimatePresence>
        </div>
      </div>

      {screen === "matches" ? (
        <form
          onSubmit={handleSubmit}
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
                selectOptions={[{ id: 0, name: "test" }]}
                handleChange={() => console.log("...")}
                defaultSelected={tournament?.status?.status ?? ""}
              />
            </div>
            <div className="input-field">
              <label className="input-field__title">Tim 2</label>
              <SelectInput
                selectOptions={[{ id: 0, name: "test" }]}
                handleChange={() => console.log("...")}
                defaultSelected={tournament?.status?.status ?? ""}
              />
            </div>
            <div className="input-field">
              <label className="input-field__title">Tim 3</label>
              <SelectInput
                selectOptions={[{ id: 0, name: "test" }]}
                handleChange={() => console.log("...")}
                defaultSelected={tournament?.status?.status ?? ""}
              />
            </div>
            <div className="input-field">
              <label className="input-field__title">Tim 4</label>
              <SelectInput
                selectOptions={[{ id: 0, name: "test" }]}
                handleChange={() => console.log("...")}
                defaultSelected={tournament?.status?.status ?? ""}
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
                  setSettings((prev) => ({
                    ...prev,
                    type: +e.target.value,
                  }))
                }
                title="Izaberi tip turnira"
                name="type"
                type="select"
                selected={settings?.type}
              />

              <InputField
                onChange={() =>
                  setSettings((prev) => ({
                    ...prev,
                    superTieBreak: !prev.superTieBreak,
                  }))
                }
                title="Super Tie Break"
                value={settings.superTieBreak}
                name="isSuperTieBreak"
                className={"row"}
                type="switch"
              />

              <InputField
                onChange={() =>
                  setSettings((prev) => ({
                    ...prev,
                    double: !prev.double,
                  }))
                }
                title="Dabl"
                value={settings.double}
                name="isDouble"
                type="switch"
                className="row"
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
          onSubmit={handleSubmit}
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
            <InputField
              onChange={handleOnChange}
              title="Ime"
              name="player1"
              value={team.player1}
              placeholder="Ime"
              required
            />
            <InputField
              onChange={handleOnChange}
              title="Ime"
              name="player2"
              value={team.player2}
              placeholder="Ime"
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
  );
}

function GroupList({ tournamentId }: { tournamentId: string }) {
  return (
    <>
      {Array.from({ length: 10 }).map((_, i) => (
        <Link
          href={`/tournaments/${tournamentId}/${alphabet[i].toLowerCase()}`}
        >
          <article className="group" key={i}>
            <div className="group__header">
              <h2>
                <span>{alphabet[i]}</span> Grupa
              </h2>

              <Button type="danger">
                <IoTrashOutline />
              </Button>
            </div>

            <div className="group__list">
              <div className="team">
                <span>1.</span>
                <p className="team__player">M. Veljkovic</p>
                <p className="team__player">S. Andjelkovic</p>
              </div>
              <div className="team">
                <span>2.</span>
                <p className="team__player">S. Petrovic</p>
                <p className="team__player">K. Milenkovic</p>
              </div>
              <div className="team">
                <span>3.</span>
                <p className="team__player">M. Jovanovic</p>
                <p className="team__player">S. Boncic</p>
              </div>
              <div className="team">
                <span>4.</span>
                <p className="team__player">M. Kostic</p>
                <p className="team__player">S. Stankovic</p>
              </div>
            </div>
          </article>
        </Link>
      ))}
    </>
  );
}

function TeamList() {
  return <h1>Team list...</h1>;
}

const alphabet = Array.from({ length: 26 }, (_, i) =>
  String.fromCharCode(i + 65)
);
