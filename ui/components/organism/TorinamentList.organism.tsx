"use client";

import Link from "next/link";
import { useState } from "react";

import InputField from "../atoms/InputField.atom";
import Button from "@/ui/components/atoms/Button.atom";

import useTournaments from "@/ui/hooks/useTournaments";

import { IoAddCircleOutline, IoChevronForwardOutline } from "react-icons/io5";

import "@/ui/styles/organism/tournaments.organism.scss";
import { useDeleteTournament } from "@/infrastructure/mutations/tournaments";
import { LucideTrash2 } from "lucide-react";

export function TournamentsList() {
  const { tournaments, addNewTournament } = useTournaments();

  const [tournamentTitle, setTournamentTitle] = useState("");

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    addNewTournament({ title: tournamentTitle });
    setTournamentTitle("");
  }

  const { mutate: deleteTournament } = useDeleteTournament();

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
          <Link
            href={{
              pathname: `/tournaments/${tournament.id}`,
              query: {
                phase: "groups",
              },
            }}
          >
            <h3 className="title">{tournament?.title}</h3>
          </Link>
          <div className="ctas">
            <Button
              type="danger"
              onClick={() => deleteTournament(tournament.id)}
            >
              {/* Obrisi */}
              <LucideTrash2 />
            </Button>
            <Link
              href={{
                pathname: `/tournaments/${tournament.id}`,
                query: {
                  phase: "groups",
                },
              }}
            >
              <Button className="cta-slide" type="primary">
                Detalji <IoChevronForwardOutline />
              </Button>
            </Link>
          </div>
        </article>
      ))}
    </section>
  );
}
