"use client";

import Image from "next/image";
import { useRef } from "react";
import { AnimatePresence } from "framer-motion";

import Button from "@/ui/components/atoms/Button.atom";
import TournamentCard from "@/ui/components/moleculs/TournamentCard.molecul";

import useTournaments from "@/ui/hooks/useTournaments";

import tennisBallImage from "@/public/img/tennisBall.png";

import { IoChevronForwardOutline } from "react-icons/io5";
import "@/ui/styles/organism/tournaments.organism.scss";

export default function Tournamets() {
  const { tournaments } = useTournaments();

  const ref = useRef<HTMLDivElement | null>(null);

  const handleClick = () => {
    const parent = ref.current?.parentElement;

    parent?.children[1].scrollIntoView();
  };

  if (!tournaments?.length) {
    return (
      <div className="tournaments">
        <div className="tournaments__header">
          <h2 className="title">
            Trenutno nema zapisa <Image src={tennisBallImage} alt="" />
            <Button onClick={handleClick} className="cta-slide" type="fade">
              Dodaj meč <IoChevronForwardOutline />
            </Button>
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className="tournaments" id="tournaments">
      <div className="tournaments__header">
        <h2 className="title">Turniri</h2>
        <Button onClick={handleClick} className="cta-slide" type="fade">
          Dodaj meč <IoChevronForwardOutline />
        </Button>
      </div>
      <div className="tournaments__list">
        <AnimatePresence>
          {tournaments?.map((n, i) => (
            <TournamentCard key={i} {...n} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
