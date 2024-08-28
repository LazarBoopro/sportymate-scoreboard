"use client";

import useSingleTournament from "@/ui/hooks/useSingleTournament.hook";
import { useEffect, useRef, useState } from "react";
import "@/ui/styles/pages/profile.page.scss";
import "@/ui/styles/pages/tournament.page.scss";

import { AnimatePresence } from "framer-motion";
import { IoAddSharp, IoTrashBinOutline, IoTrashOutline } from "react-icons/io5";
import Button from "@/ui/components/atoms/Button.atom";
import InputField from "@/ui/components/atoms/InputField.atom";
import SelectFIeld from "@/ui/components/atoms/SelectField.atom";
import SelectInput from "@/ui/components/moleculs/Select.molecul";

export default function SingleTournament({ params }: { params: { id: string } }) {
    const { tournament } = useSingleTournament({ id: params.id });

    const tournamentButtonRef = useRef<HTMLButtonElement | null>(null);

    const [screen, setScreen] = useState<"matches" | "teams">("matches");
    const [position, setPosition] = useState({
        left: 0,
        width: 0,
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
                        {screen === "matches" ? <GroupList /> : <TeamList />}
                    </AnimatePresence>
                </div>
            </div>

            <form
                // onSubmit={handleSubmit}
                className="tournament-form__form"
            >
                <section>
                    <SelectInput
                        selectOptions={[{ id: 0, name: "test" }]}
                        handleChange={() => console.log("...")}
                        defaultSelected={tournament?.status?.status ?? ""}
                    />
                </section>
            </form>
        </main>
    );
}

function GroupList() {
    return (
        <>
            {Array.from({ length: 10 }).map((_, i) => (
                <article className="group" key={i}>
                    <div className="group__header">
                        <h2>
                            <span>{alphabet[i]}</span> Grupa
                        </h2>

                        <Button type="danger">
                            <IoTrashOutline />
                        </Button>
                    </div>

                    <div className="group__list">
                        <div className="team">
                            <span>1.</span>
                            <p className="team__player">M. Veljkovic</p>
                            <p className="team__player">S. Andjelkovic</p>
                        </div>
                        <div className="team">
                            <span>2.</span>
                            <p className="team__player">S. Petrovic</p>
                            <p className="team__player">K. Milenkovic</p>
                        </div>
                        <div className="team">
                            <span>3.</span>
                            <p className="team__player">M. Jovanovic</p>
                            <p className="team__player">S. Boncic</p>
                        </div>
                        <div className="team">
                            <span>4.</span>
                            <p className="team__player">M. Kostic</p>
                            <p className="team__player">S. Stankovic</p>
                        </div>
                    </div>
                </article>
            ))}
        </>
    );
}

function TeamList() {
    return <h1>Team list...</h1>;
}

const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(i + 65));
