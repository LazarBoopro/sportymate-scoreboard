import { MatchTypeEnum } from "@/interfaces/enums";
import { TournamentType } from "@/interfaces/tournaments";
import { database } from "@/lib/firebaseConfig";
import { get, push, ref, remove, update } from "firebase/database";

export const addTournament = (data: { title: string }) => {
    const tournament: TournamentType = {
        title: data.title,
        matches: {
            groups: {},
            "quarter-finals": {
                A: {
                    double: true,
                    goldenPoint: false,
                    name: "A",
                    superTieBreak: true,
                    type: MatchTypeEnum.STANDARD,
                    teams: [],
                },
            },
            "round-of-16": {
                A: {
                    double: true,
                    goldenPoint: false,
                    name: "A",
                    superTieBreak: true,
                    type: MatchTypeEnum.STANDARD,
                    teams: [],
                },
            },
            "semi-final": {
                A: {
                    double: true,
                    goldenPoint: false,
                    name: "A",
                    superTieBreak: true,
                    type: MatchTypeEnum.STANDARD,
                    teams: [],
                },
            },
            final: {
                A: {
                    double: true,
                    goldenPoint: false,
                    name: "A",
                    superTieBreak: true,
                    type: MatchTypeEnum.STANDARD,
                    teams: [],
                },
            },
        },
        teams: {},
    };

    const tournametsRef = ref(database, "tournaments");

    return push(tournametsRef, tournament);
};

export const deleteTournament = (id: string) => {
    const tournamentsRef = ref(database, `tournaments/${id}`);

    return remove(tournamentsRef);
};

export const getSingleTournament = async (id: string) => {
    const tournamentsRef = ref(database, `tournaments/${id}`);

    const snapshot = await get(tournamentsRef);
    if (snapshot.exists()) {
        return snapshot.val();
    } else {
        throw new Error("Game not found");
    }
};

export const updateTournament = async ({
    id,
    data,
    path,
}: {
    id: string;
    data: TournamentType;
    path: string;
}) => {
    update(ref(database, `tournaments/${id}${path}`), data);
};
