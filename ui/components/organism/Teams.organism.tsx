"use client";

import useSingleTournament from "@/ui/hooks/useSingleTournament.hook";
import { useEffect, useRef, useState } from "react";
import "@/ui/styles/pages/profile.page.scss";
import "@/ui/styles/pages/tournament.page.scss";
import { AnimatePresence } from "framer-motion";
import {
    IoAddCircleOutline,
    IoChevronBack,
    IoChevronBackCircleOutline,
    IoChevronUpCircleOutline,
    IoPencilSharp,
    IoSaveOutline,
    IoTrashBinOutline,
    IoTrashOutline,
} from "react-icons/io5";
import Button from "@/ui/components/atoms/Button.atom";
import SelectInput from "@/ui/components/moleculs/Select.molecul";
import Link from "next/link";
import InputField from "@/ui/components/atoms/InputField.atom";
import { deleteTeam } from "@/infrastructure/services/tournaments";

export function TeamList({
    teams,
    handleEdit,
    deleteTeam,
}: {
    teams: any[];
    deleteTeam: (teamId: string) => void;
    handleEdit: (
        teamId: string,
        data: {
            player1: { firstName: string; lastName: string };
            player2: { firstName: string; lastName: string };
        }
    ) => void;
}) {
    if (!teams) return <div>Nema timova</div>;
    return Object.keys(teams).map((key, i) => (
        // @ts-ignore
        <Team
            key={i}
            id={key}
            // @ts-ignore
            player1={teams[key].player1}
            // @ts-ignore
            player2={teams[key].player2}
            deleteTeam={deleteTeam}
            handleEdit={handleEdit}
        />
    ));
}

export function Team({
    id,
    player1,
    player2,
    deleteTeam,
    handleEdit,
}: {
    id: string;
    player1: { firstName: string; lastName: string };
    player2: { firstName: string; lastName: string };
    deleteTeam: (teamId: string) => void;
    handleEdit: (
        teamId: string,
        data: {
            player1: { firstName: string; lastName: string };
            player2: { firstName: string; lastName: string };
        }
    ) => void;
}) {
    const [editing, setEditing] = useState(false);
    const [info, setInfo] = useState({
        player1,
        player2,
    });

    const handleClick = () => {
        if (editing) {
            // const originalInfo = JSON.stringify({ player1, player2 });
            // const editedInfo = JSON.stringify(info);

            // console.log(originalInfo, editedInfo);

            // if (originalInfo !== editedInfo) {
            //     console.log("save!");
            // }
            handleEdit(id, info);

            setEditing(false);

            return;
        }

        setEditing(true);
    };

    const handleChange = (e: any) => {
        const [player, name] = e.target.name.split(".");
        const tmpTeam = { ...info };

        //@ts-ignore
        tmpTeam[player][name] = e.target.value;

        setInfo(tmpTeam);
        // setInfo({
        //     ...info,
        //     [e.target.name]: e.target.value,
        // });
    };

    return (
        <article className="single-team">
            <div className="details">
                {!editing ? (
                    <p>{player1.firstName + " " + player1.lastName}</p>
                ) : (
                    <>
                        <InputField
                            name="player1.firstName"
                            onChange={handleChange}
                            value={info.player1.firstName}
                            placeholder="Ime"
                        />

                        <InputField
                            name="player1.lastName"
                            onChange={handleChange}
                            placeholder="Prezime"
                            value={info.player1.lastName}
                        />
                    </>
                )}
                {!editing ? (
                    <p>{player2.firstName + " " + player2.lastName}</p>
                ) : (
                    <>
                        <InputField
                            name="player2.firstName"
                            onChange={handleChange}
                            value={info.player2.firstName}
                            placeholder="Ime"
                        />
                        <InputField
                            name="player2.lastName"
                            onChange={handleChange}
                            value={info.player2.lastName}
                            placeholder="Prezime"
                        />
                    </>
                )}
            </div>

            <div className="ctas">
                <Button onClick={handleClick} type={editing ? "primary" : "action"}>
                    {editing ? (
                        <>
                            Sacuvaj <IoSaveOutline />
                        </>
                    ) : (
                        <>
                            Izmeni <IoPencilSharp />
                        </>
                    )}
                </Button>
                <Button type="danger" onClick={() => deleteTeam(id)}>
                    Obrisi
                    <IoTrashOutline />
                </Button>
            </div>
        </article>
    );
}
