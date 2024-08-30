"use client";

import useSingleTournament from "@/ui/hooks/useSingleTournament.hook";
import { useEffect, useRef, useState } from "react";
import "@/ui/styles/pages/profile.page.scss";
import "@/ui/styles/pages/tournament.page.scss";
import { AnimatePresence } from "framer-motion";
import { IoAddCircleOutline, IoChevronBack } from "react-icons/io5";
import Button from "@/ui/components/atoms/Button.atom";
import SelectInput from "@/ui/components/moleculs/Select.molecul";
import Link from "next/link";
import InputField from "@/ui/components/atoms/InputField.atom";
import { TeamList } from "@/ui/components/organism/Teams.organism";
import { GroupList } from "@/ui/components/organism/Groups.organism";
import Tabs from "@/ui/components/moleculs/Tabs.molecul";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { GroupPhaseEnum } from "@/interfaces/tournaments";
import CreateGroup from "@/ui/components/organism/CreateGroup.organism";

const phases = [
    {
        id: "groups",
        label: "Grupe",
    },
    {
        id: "round-of-16",
        label: "Osmina finala",
    },
    {
        id: "quarter-finals",
        label: "Cetvrtina finala",
    },
    {
        id: "semi-final",
        label: "Polovina finala",
    },
    {
        id: "final",
        label: "Finale",
    },
];

export default function SingleTournament({ params }: { params: { id: string } }) {
    const {
        tournament,
        deleteGroup,
        handleAddGroup,
        group,
        setGroup,
        groups,
        handleAddTeam,
        handleOnChangeTeam,
        team,
        teams,
        deleteTeam,
        handleUpdateTeam,
        phase,
    } = useSingleTournament({ id: params.id });

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

    const pathname = usePathname();
    const queryParams = useSearchParams();

    const handleMouseClick = (e: any) => {
        setPosition({
            left: e?.target?.offsetLeft || tournamentButtonRef?.current?.offsetLeft,
            width:
                e?.target?.getBoundingClientRect().width ||
                tournamentButtonRef?.current?.getBoundingClientRect().width,
        });
        setScreen(e.target.dataset.type);
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        // TODO: Save changes to the tournament
        console.log("Settings updated:", settings);
    };

    const handleDeleteTeam = (teamId: string) => {
        deleteTeam({ tournamentId: params.id, teamId });
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
                    <div className="header">
                        <Link href={"/"} className="back">
                            <IoChevronBack />
                        </Link>

                        <h1>{tournament?.title}</h1>
                    </div>
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

                {screen === "matches" && (
                    <div className="phase-switch">
                        {phases.map((n, i) => (
                            <Link
                                href={{
                                    pathname,
                                    query: {
                                        phase: n.id,
                                    },
                                }}
                                key={i}
                                className={
                                    n.id === queryParams.get("phase") ? "link active" : "link"
                                }
                            >
                                {n.label}
                            </Link>
                        ))}
                    </div>
                )}

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
                                        phase:
                                            (queryParams.get("phase") as GroupPhaseEnum) ??
                                            GroupPhaseEnum.GROUPS,
                                    })
                                }
                            />
                        ) : (
                            <TeamList
                                teams={teams}
                                deleteTeam={handleDeleteTeam}
                                handleEdit={handleUpdateTeam}
                            />
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {screen === "matches" ? (
                <>
                    <CreateGroup tournamentId={params.id} />
                    {/* <form
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
                                    selectOptions={Object.keys?.(teams)?.map?.((el) => ({
                                        id: el,
                                        // name: teams[el]
                                        //     .map((t: any) => t.firstName + " " + t.lastName)
                                        //     .join(", "),

                                        name:
                                            teams[el].player1.firstName +
                                            " " +
                                            teams[el].player1.lastName +
                                            ", " +
                                            teams[el].player2.firstName +
                                            " " +
                                            teams[el].player2.lastName,
                                    }))}
                                    handleChange={(val: string) => {
                                        const tmpTeams = [...group.teams];
                                        tmpTeams[0] = {
                                            // first: `${teams[val]?.[0]?.firstName} ${teams[val]?.[0]?.lastName}`,
                                            // second: `${teams[val]?.[1]?.firstName} ${teams[val]?.[1]?.lastName}`,
                                            player1: teams[val]?.player1,
                                            player2: teams[val]?.player2,
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
                               
                                <SelectInput
                                    selectOptions={Object.keys(teams).map((el) => ({
                                        id: el,
                                        // name: teams[el]
                                        //     .map((t: any) => t.firstName + " " + t.lastName)
                                        //     .join(", "),

                                        name:
                                            teams[el].player1.firstName +
                                            " " +
                                            teams[el].player1.lastName +
                                            ", " +
                                            teams[el].player2.firstName +
                                            " " +
                                            teams[el].player2.lastName,
                                    }))}
                                    handleChange={(val: string) => {
                                        const tmpTeams = [...group.teams];
                                        tmpTeams[1] = {
                                            // first: `${teams[val]?.[0]?.firstName} ${teams[val]?.[0]?.lastName}`,
                                            // second: `${teams[val]?.[1]?.firstName} ${teams[val]?.[1]?.lastName}`,
                                            player1: teams[val]?.player1,
                                            player2: teams[val]?.player2,
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
                              

                                <SelectInput
                                    selectOptions={Object.keys(teams).map((el) => ({
                                        id: el,
                                        // name: teams[el]
                                        //     .map((t: any) => t.firstName + " " + t.lastName)
                                        //     .join(", "),
                                        name:
                                            teams[el].player1.firstName +
                                            " " +
                                            teams[el].player1.lastName +
                                            ", " +
                                            teams[el].player2.firstName +
                                            " " +
                                            teams[el].player2.lastName,
                                    }))}
                                    handleChange={(val: string) => {
                                        const tmpTeams = [...group.teams];
                                        tmpTeams[2] = {
                                            // first: `${teams[val]?.[0]?.firstName} ${teams[val]?.[0]?.lastName}`,
                                            // second: `${teams[val]?.[1]?.firstName} ${teams[val]?.[1]?.lastName}`,
                                            player1: teams[val]?.player1,
                                            player2: teams[val]?.player2,
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
                              

                                <SelectInput
                                    selectOptions={Object.keys(teams).map((el) => ({
                                        id: el,
                                        // name: teams[el]
                                        //     .map((t: any) => t.firstName + " " + t.lastName)
                                        //     .join(", "),

                                        name:
                                            teams[el].player1.firstName +
                                            " " +
                                            teams[el].player1.lastName +
                                            ", " +
                                            teams[el].player2.firstName +
                                            " " +
                                            teams[el].player2.lastName,
                                    }))}
                                    handleChange={(val: string) => {
                                        const tmpTeams = [...group.teams];
                                        tmpTeams[3] = {
                                            // first: `${teams[val]?.[0]?.firstName} ${teams[val]?.[0]?.lastName}`,
                                            // second: `${teams[val]?.[1]?.firstName} ${teams[val]?.[1]?.lastName}`,
                                            player1: teams[val]?.player1,
                                            player2: teams[val]?.player2,
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
                                            ? `${group.teams?.[3]?.player1?.firstName} ${group.teams?.[3]?.player1?.lastName} ${group.teams?.[3]?.player2?.firstName} ${group.teams?.[3]?.player2?.lastName}`
                                            : "Izaberite igraca"
                                    }
                                />
                            </div>

                            <div
                                className="divider"
                                style={{
                                    height: "1px",
                                    width: "100%",
                                    borderBottom: "1px solid #ccc",
                                }}
                            ></div>

                            <section
                                style={{
                                    display: "flex",
                                    gap: "1rem",
                                    flexDirection: "column",
                                }}
                            >
                                <Tabs
                                    onChange={(e) =>
                                        setGroup((prev: any) => ({
                                            ...prev,
                                            type: +e.target.value,
                                        }))
                                    }
                                    title="Izaberi tip turnira"
                                    name="type"
                                    type="select"
                                    selected={group?.type}
                                />

                                <InputField
                                    onChange={() =>
                                        setGroup((prev: any) => ({
                                            ...prev,
                                            superTieBreak: !prev.superTieBreak,
                                        }))
                                    }
                                    title="Super Tie Break"
                                    value={group.superTieBreak}
                                    name="isSuperTieBreak"
                                    className={"row"}
                                    type="switch"
                                />

                            
                            </section>

                            <div
                                className="divider"
                                style={{
                                    height: "1px",
                                    width: "100%",
                                    borderBottom: "1px solid #ccc",
                                    marginBottom: "auto",
                                }}
                            ></div>

                            <Button>
                                dodaj grupu <IoAddCircleOutline />
                            </Button>
                        </section>
                    </form> */}
                </>
            ) : (
                <form
                    onSubmit={handleSubmit}
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
                            Dodaj novi tim
                        </h2>
                        <p>Igrac 1:</p>
                        <InputField
                            onChange={handleOnChangeTeam}
                            title="Ime"
                            name="player1.firstName"
                            value={team.player1.firstName}
                            placeholder="Ime"
                            required
                        />
                        <InputField
                            onChange={handleOnChangeTeam}
                            title="Prezime"
                            name="player1.lastName"
                            value={team.player1.lastName}
                            placeholder="Prezime"
                            required
                        />
                        <p>Igrac 2:</p>

                        <InputField
                            onChange={handleOnChangeTeam}
                            title="Ime"
                            name="player2.firstName"
                            value={team.player2.firstName}
                            placeholder="Ime"
                            required
                        />
                        <InputField
                            onChange={handleOnChangeTeam}
                            title="Prezime"
                            name="player2.lastName"
                            value={team.player2.lastName}
                            placeholder="Prezime"
                            required
                        />

                        <div
                            className="divider"
                            style={{
                                height: "1px",
                                width: "100%",
                                borderBottom: "1px solid #ccc",
                                marginBottom: "auto",
                            }}
                        ></div>
                        <Button onClick={handleAddTeam}>
                            dodaj tim <IoAddCircleOutline />
                        </Button>
                    </section>
                </form>
            )}
        </main>
    );
}

// ------------------------
const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(i + 65));
