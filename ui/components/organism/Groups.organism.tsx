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
import { useSearchParams } from "next/navigation";

export function GroupList({
    tournamentId,
    groups,
    handleDelete,
}: {
    tournamentId: string;
    groups: any[];
    handleDelete: any;
}) {
    const queryParams = useSearchParams();

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
                    <Link
                        href={{
                            pathname: `/tournaments/${tournamentId}/${key}`,
                            query: {
                                phase: queryParams.get("phase"),
                            },
                        }}
                    >
                        <div className="group__list">
                            {groups[key as keyof typeof groups]?.teams?.map((team: any, i: any) => (
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
