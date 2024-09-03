"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";

import Button from "@/ui/components/atoms/Button.atom";

import { MatchList } from "./MatchesList.organism";
import { TournamentsList } from "./TorinamentList.organism";

import useMatches from "@/ui/hooks/useMatches";

import { IoChevronForwardOutline } from "react-icons/io5";

import Context from "@/ui/providers/NavbarContext.provider";

import "@/ui/styles/organism/tournaments.organism.scss";

export default function Tournamets() {
  const { tournaments } = useMatches();
  const { screen, setScreen } = useContext(Context);

  const ref = useRef<HTMLDivElement | null>(null);
  const tournamentButtonRef = useRef<HTMLButtonElement | null>(null);
  const matchesButtonRef = useRef<HTMLButtonElement | null>(null);

  const [position, setPosition] = useState({
    left: 0,
    width: 0,
  });

  const handleClick = () => {
    const parent = ref.current?.parentElement;

    parent?.children[1].scrollIntoView();
  };

  const handleMouseClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!(e.target instanceof HTMLButtonElement)) {
      return;
    }

    setPosition({
      left:
        (e?.target?.offsetLeft || tournamentButtonRef?.current?.offsetLeft) ??
        0,
      width:
        (e?.target?.getBoundingClientRect().width ||
          tournamentButtonRef?.current?.getBoundingClientRect().width) ??
        0,
    });
    setScreen(e.target.dataset.type);
  };

  useEffect(() => {
    if (screen === "matches") {
      setPosition({
        left: matchesButtonRef?.current?.offsetLeft || 0,
        width: matchesButtonRef?.current?.getBoundingClientRect().width || 0,
      });
    } else {
      setPosition({
        left: tournamentButtonRef?.current?.offsetLeft || 0,
        width: tournamentButtonRef?.current?.getBoundingClientRect().width || 0,
      });
    }
  }, [tournamentButtonRef.current, tournaments]);

  if (!tournaments?.length && screen === "matches") {
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
            <button
              ref={matchesButtonRef}
              data-type="matches"
              onClick={handleMouseClick}
            >
              Mecevi
            </button>
            <div
              className="cursor"
              style={{
                ...position,
              }}
            ></div>
          </div>
          {/* <h2 className="title">
            Nema mečeva
            <Image alt="" src={tennisBallImage} />
          </h2>
          <Button onClick={handleClick} className="cta-slide" type="fade">
            Dodaj meč <IoChevronForwardOutline />
          </Button> */}
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
          <button
            ref={matchesButtonRef}
            data-type="matches"
            onClick={handleMouseClick}
          >
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
