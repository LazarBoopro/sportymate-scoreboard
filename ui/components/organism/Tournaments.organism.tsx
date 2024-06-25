"use client";

import Image from "next/image";
import { AnimatePresence } from "framer-motion";

import useTournaments from "@/ui/hooks/useTournaments";

import TournamentCard from "@/ui/components/moleculs/TournamentCard.molecul";

import tennisBallImage from "@/public/img/tennisBall.png";

import "@/ui/styles/organism/tournaments.organism.scss";

export default function Tournamets() {
  const { tournaments } = useTournaments();

  if (!tournaments?.length) {
    return (
      <div className="tournaments">
        <h2 className="no-record__title">
          Trenutno nema zapisa <Image src={tennisBallImage} alt="" />
        </h2>
        <p className="no-record__desc">
          Dodaj novi meč kako bi ga video u ovoj tabeli.
        </p>
      </div>
    );
  }

  return (
    <div className="tournaments">
      <h2 className="no-record__title" style={{ marginBottom: "1rem" }}>
        Turniri
      </h2>
      <div
        className="tournaments__list"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <AnimatePresence>
          {tournaments?.map((n, i) => (
            <TournamentCard key={i} {...n} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
