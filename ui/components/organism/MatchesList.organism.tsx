"use client";

import TournamentCard from "@/ui/components/moleculs/TournamentCard.molecul";

import { useMatches } from "@/ui/hooks/useMatches";

import "@/ui/styles/organism/tournaments.organism.scss";

export function MatchList() {
  const { matches } = useMatches();

  return matches?.map((n, i) => <TournamentCard key={i} {...n} />);
}
