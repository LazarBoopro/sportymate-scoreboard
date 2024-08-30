"use client";

import useSingleTournament from "@/ui/hooks/useSingleTournament.hook";

import "@/ui/styles/pages/watchSingle.page.scss";
import "@/ui/styles/atoms/graph.atom.scss";
import { useState } from "react";
import { IoSwapHorizontalOutline } from "react-icons/io5";

export default function WatchTournament({
  params,
}: {
  params: { id: string };
}) {
  const { tournament, groups } = useSingleTournament({ id: params.id });

  const [t, setT] = useState(false);

  return (
    <>
      <div className="heading">
        <button className="swap" onClick={() => setT((prev) => !prev)}>
          <IoSwapHorizontalOutline />
        </button>
        <h1>{tournament?.title}</h1>
      </div>
      <article className="tournament">
        {t ? (
          Object.values(groups)?.map((n: any, i: number) => (
            <Group key={i} {...n} />
          ))
        ) : (
          <Graph tournament={tournament} />
        )}
      </article>
    </>
  );
}

function Group({ name, teams }: { name: string; teams: any[] }) {
  return (
    <article className="tournament__group">
      <h2>Grupa {name}</h2>

      <table>
        <thead>
          <td>Tim</td>
          <td className="small">W</td>
          <td className="small">L</td>
        </thead>
        <tbody className="teams">
          {teams.map((t: any, i: number) => (
            <tr className="team" key={i}>
              <td key={i}>
                <p className="player">
                  {t.player1.firstName[0]}. {t.player1.lastName}
                </p>
                <p className="player">
                  {t.player2.firstName[0]}. {t.player2.lastName}
                </p>
              </td>
              <td>0</td>
              <td>0</td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  );
}

function Graph({ tournament }: { tournament: any }) {
  // @ts-ignore
  function getName(match, type, player) {
    return `${match.players?.[type]?.[player]?.firstName[0]}. ${match.players?.[type]?.[player]?.lastName}`;
  }

  function getTeams(
    phase: string,
    slice1: number,
    slice2: number,
    arrLen: number
  ) {
    const matches = tournament?.matches?.[phase]
      ? Object.values(tournament.matches[phase]).slice(slice1, slice2)
      : [];

    if (matches.length === 0) {
      return Array.from({ length: arrLen }).map((_, i) => (
        <div key={i} className="match">
          <div className="team">
            <p>/</p>
            <p>/</p>
          </div>

          <div className="team">
            <p>/</p>
            <p>/</p>
          </div>
        </div>
      ));
    }

    return matches.map((group: any, i) => {
      if (!group.matches)
        return Array.from({ length: arrLen }).map((_, i) => (
          <div key={i} className="match">
            <div className="team">
              <p>/</p>
              <p>/</p>
            </div>

            <div className="team">
              <p>/</p>
              <p>/</p>
            </div>
          </div>
        ));
      return Object.keys(group.matches).map((m) => {
        return (
          <div key={m} className="match">
            <div className="team">
              <p>{getName(group.matches?.[m], "host", "player1")}</p>
              <p>{getName(group.matches[m], "host", "player2")}</p>
            </div>

            <div className="team">
              <p>{getName(group.matches[m], "guest", "player1")}</p>
              <p>{getName(group.matches[m], "guest", "player2")}</p>
            </div>
          </div>
        );
      });
    });
  }

  const finals =
    tournament?.matches?.final &&
    Object.keys(tournament.matches.final).map((finalGroupKeys) => {
      return Object.keys(tournament.matches.final[finalGroupKeys]?.matches).map(
        (finalMatchKey: any) => {
          // console.log(finalMatch, "FINAL", tournament.matches.final[finalGroupKeys]);

          const finalMatch =
            tournament.matches.final[finalGroupKeys]?.matches[finalMatchKey];
          return {
            players: {
              host: {
                player1:
                  finalMatch.players?.host.player1.firstName[0] +
                  ". " +
                  finalMatch.players?.host.player1.lastName,
                player2:
                  finalMatch.players?.host.player2.firstName[0] +
                  ". " +
                  finalMatch.players?.host.player2.lastName,
              },
              guest: {
                player1:
                  finalMatch.players?.guest.player1.firstName[0] +
                  ". " +
                  finalMatch.players?.guest.player1.lastName,
                player2:
                  finalMatch.players?.guest.player2.firstName[0] +
                  ". " +
                  finalMatch.players?.guest.player2.lastName,
              },
            },
          };
        }
      )?.[0];
    })?.[0];

  if (!tournament) return null;
  return (
    <section className="graph">
      {/* LEFT */}

      <div className="sixteen-finals left group">
        {getTeams("round-of-16", 0, 2, 4)}
      </div>

      <div className="quarter-finals left group">
        {getTeams("quarter-finals", 0, 1, 2)}
      </div>

      <div className="semi-finals left group">
        {getTeams("semi-final", 0, 1, 1)}
      </div>

      <div className="finals left group">
        <div className="team">
          <p>{finals ? finals.players.host.player1 : "/"} </p>
          <p>{finals ? finals.players.host.player2 : "/"} </p>
        </div>
      </div>
      <p className="vs">VS</p>
      {/* RIGHT */}
      <div className="finals right group">
        <div className="team">
          <p>{finals ? finals.players.guest.player1 : "/"} </p>
          <p>{finals ? finals.players.guest.player2 : "/"} </p>
        </div>
      </div>

      <div className="semi-finals right group">
        {getTeams("semi-final", 1, 2, 1)}
      </div>

      <div className="quarter-finals right group">
        {getTeams("quarter-finals", 1, 2, 2)}
      </div>

      <div className="sixteen-finals right group">
        {getTeams("round-of-16", 2, 4, 4)}
      </div>
    </section>
  );
}
