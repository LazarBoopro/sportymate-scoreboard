"use client";

import Link from "next/link";
import { useContext, useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Image from "next/image";

import InputField from "../atoms/InputField.atom";
import Button from "@/ui/components/atoms/Button.atom";
import TournamentCard from "@/ui/components/moleculs/TournamentCard.molecul";

import useTournaments from "@/ui/hooks/useTournaments";
import useMatches from "@/ui/hooks/useMatches";

import tennisBallImage from "@/public/img/tennisBall.png";

import { IoAddCircleOutline, IoChevronForwardOutline } from "react-icons/io5";

import Context from "@/ui/providers/NavbarContext.provider";

import "@/ui/styles/organism/tournaments.organism.scss";

export default function Tournamets() {
  const { tournaments } = useMatches();
  const { screen, setScreen } = useContext(Context);

  const ref = useRef<HTMLDivElement | null>(null);
  const tournamentButtonRef = useRef<HTMLButtonElement | null>(null);

  const [position, setPosition] = useState({
    left: 0,
    width: 0,
  });

  const handleClick = () => {
    const parent = ref.current?.parentElement;

    parent?.children[1].scrollIntoView();
  };

  const handleMouseClick = (e: any) => {
    setPosition({
      left: e?.target?.offsetLeft || tournamentButtonRef?.current?.offsetLeft,
      width:
        e?.target?.getBoundingClientRect().width ||
        tournamentButtonRef?.current?.getBoundingClientRect().width,
    });
    setScreen(e.target.dataset.type);
  };

  useEffect(() => {
    setPosition({
      left: tournamentButtonRef?.current?.offsetLeft || 0,
      width: tournamentButtonRef?.current?.getBoundingClientRect().width || 0,
    });
  }, [tournamentButtonRef.current, tournaments]);

  if (!tournaments?.length && screen === "matches") {
    return (
      <div ref={ref} className="tournaments" id="tournaments">
        <div className="tournaments__header">
          <h2 className="title">
            Nema mečeva
            <Image alt="" src={tennisBallImage} />
          </h2>
          <Button onClick={handleClick} className="cta-slide" type="fade">
            Dodaj meč <IoChevronForwardOutline />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className="tournaments" id="tournaments">
      <div className="tournaments__header">
        <div className="screen-switch">
          <button
            data-type="tournaments"
            ref={tournamentButtonRef}
            onClick={handleMouseClick}
          >
            Turniri
          </button>
          <button data-type="matches" onClick={handleMouseClick}>
            Mecevi
          </button>
          <div
            className="cursor"
            style={{
              ...position,
            }}
          ></div>
        </div>
        {screen === "matches" && (
          <Button onClick={handleClick} className="cta-slide" type="fade">
            Dodaj meč <IoChevronForwardOutline />
          </Button>
        )}
      </div>
      <div className="tournaments__list">
        <AnimatePresence>
          {screen === "matches" ? <MatchList /> : <TournamentsList />}
        </AnimatePresence>
      </div>
    </div>
  );
}

function TournamentsList() {
  const { tournaments, addNewTournament } = useTournaments();

  const [tournamentTitle, setTournamentTitle] = useState("");

  function handleSubmit(e: any) {
    e.preventDefault();
    addNewTournament({ title: tournamentTitle });
    setTournamentTitle("");
  }

  return (
    <section className="t-list">
      <form className="t-list__tournament form" onSubmit={handleSubmit}>
        <InputField
          name="tournamentName"
          title="Novi turnir"
          type="text"
          value={tournamentTitle}
          placeholder="Naziv Turnira"
          required
          onChange={(e) => setTournamentTitle(e.target.value)}
        />
        <Button className="cta-slide" type="primary">
          Dodaj turnir <IoAddCircleOutline />
        </Button>
      </form>
      <div className="divider"></div>
      {/* ADD NEW TOURNAMENT */}
      {tournaments?.map((tournament, i) => (
        <article key={tournament?.id || i} className="t-list__tournament">
          <h3 className="title">{tournament?.title}</h3>
          <Link href={`/tournaments/${tournament.id}`}>
            <Button className="cta-slide" type="primary">
              Detalji <IoChevronForwardOutline />
            </Button>
          </Link>
        </article>
      ))}
    </section>
  );
}

function MatchList() {
  const { tournaments } = useMatches();

  return tournaments?.map((n, i) => <TournamentCard key={i} {...n} />);
}
