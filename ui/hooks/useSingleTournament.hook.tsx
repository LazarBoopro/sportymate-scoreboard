"use client";

import { useToast } from "@/components/ui/use-toast";
import { useAddGroup, useDeleteGroup, useUpdateGroup } from "@/infrastructure/mutations/group";
import { useAddTeam, useDeleteTeam, useUpdateTeam } from "@/infrastructure/mutations/teams";
import { GroupPhaseEnum } from "@/interfaces/tournaments";
import { database } from "@/lib/firebaseConfig";
import { onValue, ref } from "firebase/database";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(i + 65));

export default function useSingleTournament({ id, groupId }: { id: string; groupId?: string }) {
    // states
    const [tournament, setTournament] = useState<any>(null);
    const [group, setGroup] = useState<any>({
        teams: [],
        double: true,
        superTieBreak: true,
        type: 0,
    });
    const [team, setTeam] = useState({
        player1: { firstName: "", lastName: "" },
        player2: { firstName: "", lastName: "" },
    });
    const { toast } = useToast();
    const router = useRouter();
    const queryParams = useSearchParams();
    const phase = (queryParams.get("phase") as GroupPhaseEnum) ?? "groups";

    // services
    const { mutate: addGroup, isSuccess: isAddGroupSuccess } = useAddGroup();
    const { mutate: deleteGroup } = useDeleteGroup(onDeleteSuccess);
    const { mutate: updateGroup } = useUpdateGroup();

    const { mutate: addTeam, isSuccess: isAddTeamSuccess } = useAddTeam();
    const { mutate: deleteTeam } = useDeleteTeam();
    const { mutate: updateTeam } = useUpdateTeam();

    // functions

    function handleOnChangeTeam(e: any) {
        const [player, name] = e.target.name.split(".");
        const tmpTeam = { ...team };

        //@ts-ignore
        tmpTeam[player][name] = e.target.value;

        setTeam(tmpTeam);
    }

    function handleAddTeam() {
        addTeam({ tournamentId: id, data: team });
    }

    function handleUpdateTeam(
        teamId: string,
        data: {
            player1: { firstName: string; lastName: string };
            player2: { firstName: string; lastName: string };
        }
    ) {
        updateTeam({ tournamentId: id, teamId, data });
    }

    function onDeleteSuccess() {}

    function handleAddGroup(ev: any) {
        ev.preventDefault();

        // const phase = (queryParams.get("phase") as GroupPhaseEnum) ?? "groups";

        const groupLen = tournament?.matches?.[phase]
            ? Object.keys(tournament?.matches?.[phase])?.length
            : 0;

        // const matches = [];
        // const len = group.teams.length;
        // for (let i = 0; i < len - 1; i++) {
        //     for (let j = i + 1; j < len; j++) {
        //         const payload = {
        //             matchId: Math.floor(Math.random() * 100),

        //             title: tournament.title,

        //             status: {
        //                 id: 12,
        //                 status: "idle",
        //             },
        //             superTieBreak: true,
        //             type: 2,
        //             players: {
        //                 guest: group.teams[i],
        //                 host: group.teams[j],
        //             },
        //             score: {
        //                 currentSet: [0, 0],
        //                 sets: [
        //                     {
        //                         [0]: 0,
        //                         [1]: 0,
        //                     },
        //                 ],
        //                 tiebreak: [0, 0],
        //             },
        //             winner: null,
        //         };

        //         matches.push(payload);
        //     }
        // }

        addGroup({
            data: {
                matches: [],
                name: alphabet[groupLen],
                ...group,
            },
            tournamentId: id,
            groupId: alphabet[groupLen],
            phase,
        });
    }

    useEffect(() => {
        if (isAddGroupSuccess) {
            setGroup({ teams: [], double: true, superTieBreak: true, type: 0 });
        }
        if (isAddTeamSuccess) {
            setTeam({
                player1: { firstName: "", lastName: "" },
                player2: {
                    firstName: "",
                    lastName: "",
                },
            });
        }
    }, [isAddGroupSuccess, isAddTeamSuccess]);
    // Firebase
    useEffect(() => {
        const matchsRef = ref(database, `tournaments/${id}`);

        const unsubscribe = onValue(matchsRef, (snapshot) => {
            const data: any = snapshot.val();

            if (!data) {
                setTournament(null);
                router.replace("/");
                toast({
                    title: "Greška!",
                    description: `Meč ${id} ne postoji!`,
                    variant: "destructive",
                });
            }

            setTournament(data);
        });

        return () => {
            unsubscribe();
        };
    }, [id]);

    return {
        tournament,
        handleAddGroup,
        group,
        setGroup,
        groups: tournament?.matches?.[phase] ?? [],
        deleteGroup,
        handleAddTeam,
        handleOnChangeTeam,
        team,
        teams: tournament?.teams ?? [],
        deleteTeam,
        handleUpdateTeam,
        singleGroup: groupId ? tournament?.matches?.[phase]?.[groupId.toUpperCase()] : null,
        updateGroup,
        phase,
        matches: groupId ? tournament?.matches?.[phase]?.[groupId.toUpperCase()]?.matches : [],
    };
}
