"use client";

import { useToast } from "@/components/ui/use-toast";
import { useAddGroup, useDeleteGroup } from "@/infrastructure/mutations/group";
import { database } from "@/lib/firebaseConfig";
import { onValue, ref } from "firebase/database";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(i + 65));

export default function useSingleTournament({ id }: { id: string }) {
    // states
    const [tournament, setTournament] = useState<any>(null);
    const [group, setGroup] = useState<any>({ teams: [] });

    const { toast } = useToast();
    const router = useRouter();

    // services
    const { mutate: addGroup, isSuccess: isAddSuccess } = useAddGroup();
    const { mutate: deleteGroup } = useDeleteGroup(onDeleteSuccess);

    // functions

    function onDeleteSuccess() {}

    function handleAddGroup(ev: any) {
        ev.preventDefault();

        console.log(tournament?.matches?.groups);

        const groupLen = tournament?.matches?.groups
            ? Object.keys(tournament?.matches?.groups)?.length
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
                teams: group.teams,
                matches: [],
                name: alphabet[groupLen],
            },
            tournamentId: id,
            groupId: alphabet[groupLen],
            phase: "groups",
        });
    }

    useEffect(() => {
        if (isAddSuccess) {
            setGroup({ teams: [] });
        }
    }, [isAddSuccess]);
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
        groups: tournament?.matches?.groups ?? [],
        deleteGroup,
    };
}
