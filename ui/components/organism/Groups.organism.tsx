"use client";
import { useSearchParams } from "next/navigation";

import Link from "next/link";
import Button from "@/ui/components/atoms/Button.atom";
import { IoTrashOutline } from "react-icons/io5";

import "@/ui/styles/pages/profile.page.scss";
import "@/ui/styles/pages/tournament.page.scss";
import { GroupType, TeamType } from "@/interfaces/tournaments";

export function GroupList({
    tournamentId,
    groups,
    handleDelete,
}: {
    tournamentId: string;
    groups: { [key: string]: GroupType } | null;
    handleDelete: (id: string) => void;
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
                            {groups[key as keyof typeof groups]?.teams?.map(
                                (team: TeamType, i: number) => (
                                    <div className="team" key={i}>
                                        <span>{i + 1}</span>
                                        <p className="team__player">{`${team.player1.firstName[0]}. ${team.player1.lastName}`}</p>
                                        {team.player2 && (
                                            <p className="team__player">{`${team.player2.firstName[0]}. ${team.player2.lastName}`}</p>
                                        )}
                                    </div>
                                )
                            )}
                        </div>
                    </Link>
                </article>
            ))}
        </>
    );
}
