"use client";

import Link from "next/link";

import useTournaments from "@/ui/hooks/useTournaments";

import "@/ui/styles/pages/watch.page.scss";

export default function Watch() {
  const { tournaments } = useTournaments();

  return (
    <>
      <h1>Turniri</h1>
      <article className="tournaments graph">
        {tournaments?.map((tournament, i) => (
          <Link
            href={`/watch/${tournament?.id}`}
            key={i}
            className="tournament"
          >
            <h3>{tournament?.title}</h3>
          </Link>
        ))}
      </article>
    </>
  );
}
