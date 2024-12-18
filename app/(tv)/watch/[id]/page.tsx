"use client";

import useSingleTournament from "@/ui/hooks/useSingleTournament.hook";

import "@/ui/styles/pages/watchSingle.page.scss";
import "@/ui/styles/atoms/graph.atom.scss";
import { Suspense, useState } from "react";
import { IoSwapHorizontalOutline } from "react-icons/io5";
import Link from "next/link";
import { watch } from "fs";
import { GroupType, TeamType, TournamentType } from "@/interfaces/tournaments";
import { GroupPhaseEnum } from "@/interfaces/enums";
import { MatchType } from "@/interfaces/matches";

export default function WatchTournament({ params }: { params: { id: string } }) {
    const { tournament, groups } = useSingleTournament({ id: params.id });

    const [t, setT] = useState(false);

    return (
        <>
            <Suspense>
                <div className="heading">
                    <button className="swap" onClick={() => setT((prev) => !prev)}>
                        <IoSwapHorizontalOutline />
                    </button>
                    <h1>{tournament?.title}</h1>
                </div>
                <article className="tv-tournament">
                    {!t ? (
                        <Suspense fallback={null}>
                            {groups &&
                                Object.values(groups)?.map((n: GroupType, i: number) => (
                                    <Group key={i} {...n} />
                                ))}
                        </Suspense>
                    ) : (
                        <Suspense fallback={null}>
                            {tournament && (
                                <Graph tournament={tournament} tournamentId={params.id} />
                            )}
                        </Suspense>
                    )}
                </article>
            </Suspense>
        </>
    );
}

function Group({ name, teams }: { name: string; teams: TeamType[] }) {
    return (
        <article className="tv-tournament__group">
            <h2>Grupa {name}</h2>

            <table>
                <thead>
                    <td>Tim</td>
                    <td className="small">W</td>
                    <td className="small">L</td>
                </thead>
                <tbody className="teams">
                    {teams.map((t: TeamType, i: number) => (
                        <tr className="team" key={i}>
                            <td key={i}>
                                <p className="player">
                                    {t.player1.firstName[0]}. {t.player1.lastName}
                                </p>
                                {t.player2 && (
                                    <p className="player">
                                        {t.player2.firstName[0]}. {t.player2.lastName}
                                    </p>
                                )}
                            </td>
                            <td>{t.wins}</td>
                            <td>{t.losses}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </article>
    );
}

function Graph({ tournament, tournamentId }: { tournament: TournamentType; tournamentId: string }) {
    // @ts-ignore
    function getName(match, type, player) {
        if (!match) return null;
        return `${match.players?.[type]?.[player]?.firstName[0]}. ${match.players?.[type]?.[player]?.lastName}`;
    }

    function getTeams(phase: GroupPhaseEnum, slice1: number, slice2: number, arrLen: number) {
        const matches = tournament?.matches?.[phase]
            ? Object.values(tournament.matches[phase]).slice(slice1, slice2)
            : [];

        if (matches.length === 0) {
            return Array.from({ length: arrLen }).map((_, i) => (
                <div key={i} className="tv-match">
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

        const mecevi = matches
            .map((group: GroupType, i) => {
                if (!group.matches) return Array.from({ length: arrLen });
                return Object.keys(group.matches).map((m) => ({
                    ...group.matches?.[m],
                    matchId: m,
                    groupId: group.name,
                }));
            })
            .flat();

        if (mecevi.length < arrLen) {
            const len = mecevi.length;

            for (let el = 0; el < arrLen - len; el++) {
                mecevi.push({
                    players: {
                        guest: {
                            player1: { firstName: "/", lastName: "/" },
                            player2: { firstName: "/", lastName: "/" },
                            teamId: "/",
                        },
                        host: {
                            player1: { firstName: "/", lastName: "/" },
                            player2: { firstName: "/", lastName: "/" },
                            teamId: "/",
                        },
                    },
                });
            }
        }

        return mecevi.map((m: any, i: number) => {
            return (
                <div key={i} className="tv-match">
                    <Link
                        href={{
                            pathname: m?.matchId ? `/match/${m?.matchId}` : "#",
                            query: m?.matchId
                                ? {
                                      tournamentId: tournamentId,
                                      phase,
                                      groupId: m?.groupId,
                                      watch: true,
                                  }
                                : undefined,
                        }}
                    >
                        <div className="team">
                            <p>{getName(m, "host", "player1") ?? "/"}</p>
                            <p>{getName(m, "host", "player2") ?? "/"}</p>
                        </div>

                        <div className="team">
                            <p>{getName(m, "guest", "player1") ?? "/"}</p>
                            <p>{getName(m, "guest", "player2") ?? "/"}</p>
                        </div>
                    </Link>
                </div>
            );
        });
    }

    const finals =
        tournament?.matches?.final &&
        Object.keys(tournament.matches.final).map((finalGroupKeys) => {
            return (
                tournament.matches.final?.A?.matches &&
                Object.keys(tournament.matches.final?.A?.matches ?? {}).map(
                    (finalMatchKey: string) => {
                        const finalMatch = tournament.matches.final?.A?.matches?.[finalMatchKey];
                        if (finalMatch)
                            return {
                                players: {
                                    host: {
                                        player1:
                                            finalMatch.players?.host.player1.firstName[0] +
                                            ". " +
                                            finalMatch.players?.host.player1.lastName,
                                        player2: finalMatch.players?.host.player2
                                            ? finalMatch.players?.host.player2.firstName[0] +
                                              ". " +
                                              finalMatch.players?.host.player2.lastName
                                            : undefined,
                                    },
                                    guest: {
                                        player1:
                                            finalMatch.players?.guest.player1.firstName[0] +
                                            ". " +
                                            finalMatch.players?.guest.player1.lastName,
                                        player2: finalMatch.players?.guest.player2
                                            ? finalMatch.players?.guest.player2.firstName[0] +
                                              ". " +
                                              finalMatch.players?.guest.player2.lastName
                                            : undefined,
                                    },
                                },
                            };
                    }
                )?.[0]
            );
        })?.[0];

    if (!tournament) return null;
    return (
        <section className="graph">
            {/* LEFT */}

            <div className="sixteen-finals left group">
                {getTeams(GroupPhaseEnum.ROUND16, 0, 2, 2)}
            </div>

            <div className="quarter-finals left group">
                {getTeams(GroupPhaseEnum.QUARTER, 0, 1, 2)}
            </div>

            <div className="semi-finals left group">
                {getTeams(GroupPhaseEnum.SEMIFINAL, 0, 1, 1)}
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
                {getTeams(GroupPhaseEnum.SEMIFINAL, 1, 2, 1)}
            </div>

            <div className="quarter-finals right group">
                {getTeams(GroupPhaseEnum.QUARTER, 1, 2, 2)}
            </div>

            <div className="sixteen-finals right group">
                {getTeams(GroupPhaseEnum.ROUND16, 2, 4, 4)}
            </div>
        </section>
    );
}
