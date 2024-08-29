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
        {/* <button>
          <IoChevronBack />
        </button> */}
        <button className="swap" onClick={() => setT((prev) => !prev)}>
          <IoSwapHorizontalOutline />
        </button>
        <h1>{tournament?.title}</h1>
      </div>
      <article className="tournament">
        {t ? (
          Object.values(groups)?.map((n: any) => <Group {...n} />)
        ) : (
          <Graph />
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
            <tr className="team">
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

function Graph() {
  return (
    <section className="graph">
      {/* LEFT */}

      <div className="sixteen-finals left group">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="match">
            <div className="team">
              <p>P. Peric</p>
              <p>P. Peric</p>
            </div>

            <div className="team">
              <p>P. Peric</p>
              <p>P. Peric</p>
            </div>
          </div>
        ))}
      </div>

      <div className="quarter-finals left group">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="match">
            <div className="team">
              <p>P. Peric</p>
              <p>P. Peric</p>
            </div>

            <div className="team">
              <p>P. Peric</p>
              <p>P. Peric</p>
            </div>
          </div>
        ))}
      </div>

      <div className="semi-finals left group">
        {Array.from({ length: 1 }).map((_, i) => (
          <div key={i} className="match">
            <div className="team">
              <p>P. Peric</p>
              <p>P. Peric</p>
            </div>

            <div className="team">
              <p>P. Peric</p>
              <p>P. Peric</p>
            </div>
          </div>
        ))}
      </div>

      <div className="finals left group">
        <div className="team">
          <p>P. Peric</p>
          <p>P. Peric</p>
        </div>
      </div>
      <p className="vs">VS</p>
      {/* RIGHT */}
      <div className="finals right group">
        <div className="team">
          <p>P. Peric</p>
          <p>P. Peric</p>
        </div>
      </div>

      <div className="semi-finals right group">
        {Array.from({ length: 1 }).map((_, i) => (
          <div key={i} className="match">
            <div className="team">
              <p>P. Peric</p>
              <p>P. Peric</p>
            </div>

            <div className="team">
              <p>P. Peric</p>
              <p>P. Peric</p>
            </div>
          </div>
        ))}
      </div>

      <div className="quarter-finals right group">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="match">
            <div className="team">
              <p>P. Peric</p>
              <p>P. Peric</p>
            </div>

            <div className="team">
              <p>P. Peric</p>
              <p>P. Peric</p>
            </div>
          </div>
        ))}
      </div>

      <div className="sixteen-finals right group">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="match">
            <div className="team">
              <p>P. Peric</p>
              <p>P. Peric</p>
            </div>

            <div className="team">
              <p>P. Peric</p>
              <p>P. Peric</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
