"use client";

import useSingleTournament from "@/ui/hooks/useSingleTournament.hook";
import { useEffect, useRef, useState } from "react";
import "@/ui/styles/pages/profile.page.scss";
import "@/ui/styles/pages/tournament.page.scss";
import { AnimatePresence } from "framer-motion";
import { IoAddCircleOutline, IoTrashOutline } from "react-icons/io5";
import Button from "@/ui/components/atoms/Button.atom";
import SelectInput from "@/ui/components/moleculs/Select.molecul";
import Link from "next/link";

const teams: any = {
    0: [
        { firstName: "ime", lastName: "prezime" },
        { firstName: "ime 1", lastName: "prezime 1" },
    ],
    1: [
        { firstName: "ime 2", lastName: "prezime 2" },
        { firstName: "ime 3", lastName: "prezime 3" },
    ],
    2: [
        { firstName: "ime 4", lastName: "prezime 4" },
        { firstName: "ime 5", lastName: "prezime 5" },
    ],
    3: [
        { firstName: "ime 6", lastName: "prezime 6" },
        { firstName: "ime 7", lastName: "prezime 7" },
    ],
};

export default function SingleTournament({ params }: { params: { id: string } }) {
    const { tournament, deleteGroup, handleAddGroup, group, setGroup, groups } =
        useSingleTournament({ id: params.id });

    const tournamentButtonRef = useRef<HTMLButtonElement | null>(null);

    const [screen, setScreen] = useState<"matches" | "teams">("matches");
    const [position, setPosition] = useState({
        left: 0,
        width: 0,
    });

    const [settings, setSettings] = useState({
        double: true,
        type: 0,
        superTieBreak: true,
    });

    const [team, setTeam] = useState({
        player1: "",
        player2: "",
    });

    const handleMouseClick = (e: any) => {
        setPosition({
            left: e?.target?.offsetLeft || tournamentButtonRef?.current?.offsetLeft,
            width:
                e?.target?.getBoundingClientRect().width ||
                tournamentButtonRef?.current?.getBoundingClientRect().width,
        });
        setScreen(e.target.dataset.type);
    };

    const handleOnChange = (e: any) => {
        setTeam((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        // TODO: Save changes to the tournament
        console.log("Settings updated:", settings);
    };

    useEffect(() => {
        setPosition({
            left: tournamentButtonRef?.current?.offsetLeft || 0,
            width: tournamentButtonRef?.current?.getBoundingClientRect().width || 0,
        });
    }, [tournamentButtonRef.current, tournament]);

    return (
        <main className="main">
            <div className="tournaments" id="tournaments">
                <div className="tournaments__header">
                    <div className="screen-switch">
                        <button data-type="matches" onClick={handleMouseClick}>
                            Grupe
                        </button>
                        <button data-type="teams" onClick={handleMouseClick}>
                            Timovi
                        </button>
                        <div
                            className="cursor"
                            style={{
                                ...position,
                            }}
                        ></div>
                    </div>
                </div>
                <div className="tournaments__list">
                    <AnimatePresence>
                        {screen === "matches" ? (
                            <GroupList
                                tournamentId={params.id}
                                //@ts-ignore
                                groups={groups}
                                //@ts-ignore
                                handleDelete={(id) =>
                                    deleteGroup({
                                        tournamentId: params.id,
                                        groupId: id,
                                        phase: "groups",
                                    })
                                }
                            />
                        ) : (
                            <TeamList />
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <form
                onSubmit={handleAddGroup}
                className="tournament-form__form"
                style={{ height: "100%0", padding: "1rem", overflow: "hidden" }}
            >
                <section
                    style={{
                        maxWidth: "100%",
                        height: "100%",
                        padding: "0",
                    }}
                >
                    <h2
                        style={{
                            fontSize: "clamp(1rem, 10vw, 1.25rem)",
                            fontWeight: "800",
                        }}
                    >
                        Dodaj novu grupu
                    </h2>
                    <div className="input-field">
                        <label className="input-field__title">Tim 1</label>
                        <SelectInput
                            selectOptions={Object.keys(teams).map((el) => ({
                                id: el,
                                name: teams[el]
                                    .map((t: any) => t.firstName + " " + t.lastName)
                                    .join(", "),
                            }))}
                            handleChange={(val: string) => {
                                const tmpTeams = [...group.teams];
                                tmpTeams[0] = {
                                    // first: `${teams[val]?.[0]?.firstName} ${teams[val]?.[0]?.lastName}`,
                                    // second: `${teams[val]?.[1]?.firstName} ${teams[val]?.[1]?.lastName}`,
                                    player1: teams[val]?.[0],
                                    player2: teams[val]?.[1],
                                    wins: 0,
                                    losses: 0,
                                    teamId: val,
                                };

                                setGroup({
                                    ...group,
                                    teams: tmpTeams,
                                });
                            }}
                            defaultSelected={
                                group.teams?.[0]
                                    ? `${group.teams?.[0]?.player1.firstName} ${group.teams?.[0]?.player1.lastName} ${group.teams?.[0]?.player2.firstName} ${group.teams?.[0]?.player2.lastName}`
                                    : "Izaberite igraca"
                            }
                        />
                    </div>
                    <div className="input-field">
                        <label className="input-field__title">Tim 2</label>
                        {/* <SelectInput
                            selectOptions={[{ id: 0, name: "test" }]}
                            handleChange={() => console.log("...")}
                            defaultSelected={tournament?.status?.status ?? ""}
                        /> */}

                        <SelectInput
                            selectOptions={Object.keys(teams).map((el) => ({
                                id: el,
                                name: teams[el]
                                    .map((t: any) => t.firstName + " " + t.lastName)
                                    .join(", "),
                            }))}
                            handleChange={(val: string) => {
                                const tmpTeams = [...group.teams];
                                tmpTeams[1] = {
                                    // first: `${teams[val]?.[0]?.firstName} ${teams[val]?.[0]?.lastName}`,
                                    // second: `${teams[val]?.[1]?.firstName} ${teams[val]?.[1]?.lastName}`,
                                    player1: teams[val]?.[0],
                                    player2: teams[val]?.[1],
                                    wins: 0,
                                    losses: 0,
                                    teamId: val,
                                };

                                setGroup({
                                    ...group,
                                    teams: tmpTeams,
                                });
                            }}
                            defaultSelected={
                                group.teams?.[1]
                                    ? `${group.teams?.[1]?.player1.firstName} ${group.teams?.[1]?.player1.lastName} ${group.teams?.[1]?.player2.firstName} ${group.teams?.[1]?.player2.lastName}`
                                    : "Izaberite igraca"
                            }
                        />
                    </div>
                    <div className="input-field">
                        <label className="input-field__title">Tim 3</label>
                        {/* <SelectInput
                            selectOptions={[{ id: 0, name: "test" }]}
                            handleChange={() => console.log("...")}
                            defaultSelected={tournament?.status?.status ?? ""}
                        /> */}

                        <SelectInput
                            selectOptions={Object.keys(teams).map((el) => ({
                                id: el,
                                name: teams[el]
                                    .map((t: any) => t.firstName + " " + t.lastName)
                                    .join(", "),
                            }))}
                            handleChange={(val: string) => {
                                const tmpTeams = [...group.teams];
                                tmpTeams[2] = {
                                    // first: `${teams[val]?.[0]?.firstName} ${teams[val]?.[0]?.lastName}`,
                                    // second: `${teams[val]?.[1]?.firstName} ${teams[val]?.[1]?.lastName}`,
                                    player1: teams[val]?.[0],
                                    player2: teams[val]?.[1],
                                    wins: 0,
                                    losses: 0,
                                    teamId: val,
                                };

                                setGroup({
                                    ...group,
                                    teams: tmpTeams,
                                });
                            }}
                            defaultSelected={
                                group.teams?.[2]
                                    ? `${group.teams?.[2]?.player1.firstName} ${group.teams?.[2]?.player1.lastName} ${group.teams?.[2]?.player2.firstName} ${group.teams?.[2]?.player2.lastName}`
                                    : "Izaberite igraca"
                            }
                        />
                    </div>
                    <div className="input-field" style={{ marginBottom: "auto" }}>
                        <label className="input-field__title">Tim 4</label>
                        {/* <SelectInput
                            selectOptions={[{ id: 0, name: "test" }]}
                            handleChange={() => console.log("...")}
                            defaultSelected={tournament?.status?.status ?? ""}
                        /> */}

                        <SelectInput
                            selectOptions={Object.keys(teams).map((el) => ({
                                id: el,
                                name: teams[el]
                                    .map((t: any) => t.firstName + " " + t.lastName)
                                    .join(", "),
                            }))}
                            handleChange={(val: string) => {
                                const tmpTeams = [...group.teams];
                                tmpTeams[3] = {
                                    // first: `${teams[val]?.[0]?.firstName} ${teams[val]?.[0]?.lastName}`,
                                    // second: `${teams[val]?.[1]?.firstName} ${teams[val]?.[1]?.lastName}`,
                                    player1: teams[val]?.[0],
                                    player2: teams[val]?.[1],
                                    wins: 0,
                                    losses: 0,
                                    teamId: val,
                                };

                                setGroup({
                                    ...group,
                                    teams: tmpTeams,
                                });
                            }}
                            defaultSelected={
                                group.teams?.[3]
                                    ? `${group.teams?.[3]?.player1.firstName} ${group.teams?.[3]?.player1.lastName} ${group.teams?.[3]?.player2.firstName} ${group.teams?.[3]?.player2.lastName}`
                                    : "Izaberite igraca"
                            }
                        />
                    </div>
                    <Button>
                        dodaj grupu <IoAddCircleOutline />
                    </Button>
                </section>
            </form>
        </main>
    );
}

function GroupList({
    tournamentId,
    groups,
    handleDelete,
}: {
    tournamentId: string;
    groups: any[];
    handleDelete: any;
}) {
    if (!groups) return <div>Nema grupa</div>;
    return (
        <>
            {Object.keys(groups).map((key, i) => (
                <article className="group" key={i}>
                    <div className="group__header">
                        <h2>
                            <span>{key}</span> Grupa
                        </h2>

                        <Button type="danger" onClick={() => handleDelete(key)}>
                            <IoTrashOutline />
                        </Button>
                    </div>
                    <Link href={`/tournaments/${tournamentId}/${alphabet[i].toLowerCase()}`}>
                        <div className="group__list">
                            {groups[key as keyof typeof groups]?.teams.map((team: any, i: any) => (
                                <div className="team" key={i}>
                                    <span>{i + 1}</span>
                                    <p className="team__player">{`${team.player1.firstName[0]}. ${team.player1.lastName}`}</p>
                                    <p className="team__player">{`${team.player2.firstName[0]}. ${team.player2.lastName}`}</p>
                                </div>
                            ))}
                        </div>
                    </Link>
                </article>
            ))}
        </>
    );
}

function TeamList() {
    return <h1>Team list...</h1>;
}

const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(i + 65));
