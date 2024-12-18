"use client";

import { useContext, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

import InputField from "@/ui/components/atoms/InputField.atom";
import Button from "@/ui/components/atoms/Button.atom";

import { IoChevronBack } from "react-icons/io5";

import Tabs from "../moleculs/Tabs.molecul";
import { useMatches } from "@/ui/hooks/useMatches";

import "@/ui/styles/organism/tournamentForm.organism.scss";
import { Switch } from "@/components/ui/switch";
import Context from "@/ui/providers/NavbarContext.provider";

export default function TournamentForm() {
  const ref = useRef<HTMLDivElement | null>(null);

  const { screen } = useContext(Context);

  const handleClick = () => {
    const parent = ref.current?.parentElement;

    parent?.children[0].scrollIntoView();
  };

  return (
    <div ref={ref} id="add-tournaments" className="tournament-form">
      <div className="header">
        <Button onClick={handleClick} className="cta-slide" type="fade">
          <IoChevronBack />
          Turniri
        </Button>
        <h2 className="title">Dodaj turnir</h2>
      </div>
      {screen === "matches" ? <MatchForm /> : null}
    </div>
  );
}

function MatchForm() {
  const {
    data,
    handleSubmit,
    isDouble,
    setIsDouble,
    handleOnChange,
    isSuperTieBreak,
    setIsSuperTieBreak,
    isAddingMatch,
    setIsGoldenPoint,
    isGoldenPoint,
  } = useMatches();

  return (
    <form onSubmit={handleSubmit} className="tournament-form__form">
      <section>
        <InputField
          onChange={handleOnChange}
          title="Naziv turnira"
          name="title"
          placeholder="Naziv turnira"
          value={data?.title ?? ""}
          required
        />

        <InputField
          name="date"
          onChange={handleOnChange}
          title="Datum"
          type="date"
          value={data?.date}
          placeholder="Datum"
          required
        />
        <div className="time-picker">
          <p>Vreme</p>
          <div className="selects">
            <select
              onChange={handleOnChange}
              className="select hours"
              name="startTime.hour"
              defaultValue={data?.startTime?.hour}
              required
            >
              {Array.from({ length: 24 }).map((_, i) => (
                <option key={i} value={i}>
                  {i.toString().padStart(2, "0")}
                </option>
              ))}
            </select>
            :
            <select
              onChange={handleOnChange}
              className="select minutes"
              name="startTime.minute"
              defaultValue={data?.startTime?.minute}
              required
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <option key={i} value={5 * i}>
                  {(5 * i).toString().padStart(2, "0")}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <div className="divider"></div>

      <section>
        <Tabs
          onChange={handleOnChange}
          title="Izaberi tip turnira"
          name="type"
          type="select"
          selected={data?.type}
        />

        <InputField
          onChange={() => setIsGoldenPoint((prev: boolean) => !prev)}
          title="Zlatni poen"
          value={isGoldenPoint}
          name="isGoldenPoint"
          className={"row"}
          type="switch"
        />

        <InputField
          onChange={() => setIsSuperTieBreak((prev: boolean) => !prev)}
          title="Super Tie Break"
          value={isSuperTieBreak}
          name="isSuperTieBreak"
          className={"row"}
          type="switch"
        />

        <InputField
          onChange={() => setIsDouble((prev: boolean) => !prev)}
          title="Dabl"
          value={isDouble}
          name="isDouble"
          type="switch"
          className="row"
        />
      </section>

      <div className="divider"></div>

      <section>
        <div className="team">
          <p className="team__title">Domaćin</p>

          <div className="team__players">
            <div className="player">
              <InputField
                onChange={handleOnChange}
                title="Ime"
                name="host.player1.firstName"
                value={data?.players.host?.player1.firstName ?? ""}
                placeholder="Ime"
                required
              />
              <InputField
                onChange={handleOnChange}
                title="Prezime"
                name="host.player1.lastName"
                value={data?.players.host?.player1.lastName ?? ""}
                placeholder="Prezime"
                required
              />
            </div>
            <AnimatePresence mode="popLayout" presenceAffectsLayout>
              {isDouble && (
                <motion.div
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="player"
                >
                  <InputField
                    onChange={handleOnChange}
                    title="Ime"
                    name="host.player2.firstName"
                    value={data?.players.host?.player2?.firstName ?? ""}
                    placeholder="Ime"
                    required
                  />
                  <InputField
                    onChange={handleOnChange}
                    title="Prezime"
                    name="host.player2.lastName"
                    value={data?.players.host?.player2?.lastName ?? ""}
                    placeholder="Prezime"
                    required
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className="team">
          <p className="team__title">Gost</p>

          <div className="team__players">
            <div className="player">
              <InputField
                onChange={handleOnChange}
                title="Ime"
                name="guest.player1.firstName"
                value={data?.players.guest?.player1.firstName ?? ""}
                placeholder="Ime"
                required
              />
              <InputField
                onChange={handleOnChange}
                title="Prezime"
                name="guest.player1.lastName"
                value={data?.players.guest?.player1.lastName ?? ""}
                placeholder="Prezime"
                required
              />
            </div>
            <AnimatePresence mode="popLayout" presenceAffectsLayout>
              {isDouble && (
                <motion.div
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="player"
                >
                  <InputField
                    onChange={handleOnChange}
                    title="Ime"
                    name="guest.player2.firstName"
                    value={data?.players.guest?.player2?.firstName ?? ""}
                    placeholder="Ime"
                    required
                  />
                  <InputField
                    onChange={handleOnChange}
                    title="Prezime"
                    name="guest.player2.lastName"
                    value={data?.players.guest?.player2?.lastName ?? ""}
                    placeholder="Prezime"
                    required
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
      <div className="divider"></div>

      <Button className={`submit ${isAddingMatch ? "pending" : ""}`}>
        Dodaj turnir
      </Button>
    </form>
  );
}
