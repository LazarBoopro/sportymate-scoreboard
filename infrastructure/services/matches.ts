import { MatchTypeService } from "@/interfaces/matches";
import { database } from "@/lib/firebaseConfig";
import { get, push, ref, remove, update } from "firebase/database";

export const addMatch = (
    data: MatchTypeService,
    tournament?: { tournamentId: string; groupId: string }
) => {
    let prefix = "";
    if (tournament) {
        prefix = `tournaments/${tournament.tournamentId}/group/${tournament.groupId}/`;
    }
    const tournamentsRef = ref(database, `${prefix}matches`);

    return push(tournamentsRef, data);
};

export const deleteMatch = (id: string, tournament?: { tournamentId: string; groupId: string }) => {
    let prefix = "";
    if (tournament) {
        prefix = `tournaments/${tournament.tournamentId}/group/${tournament.groupId}/`;
    }
    const tournamentsRef = ref(database, `${prefix}matches/${id}`);

    return remove(tournamentsRef);
};

export const getSingleMatch = async (
    id: string,
    tournament?: { tournamentId: string; groupId: string }
) => {
    let prefix = "";
    if (tournament) {
        prefix = `tournaments/${tournament.tournamentId}/group/${tournament.groupId}/`;
    }
    const tournamentsRef = ref(database, `${prefix}matches/${id}`);

    const snapshot = await get(tournamentsRef);
    if (snapshot.exists()) {
        return snapshot.val();
    } else {
        throw new Error("Game not found");
    }
};

export const updateCurrentSetScore = async ({ team, id, path, score, tournament }: any) => {
    let prefix = "";
    if (tournament) {
        prefix = `tournaments/${tournament.tournamentId}/group/${tournament.groupId}/`;
    }
    const tournamentsRef = ref(database, `${prefix}matches/${id}/score/currentSet`);

    update(tournamentsRef, {
        [team]: score,
    });
};

export const updateGemScore = async ({
    id,
    gem,
    team,
    score,
    prevScore,
    tournament,
}: {
    id: string;
    gem: number;
    team: string;
    score: number;
    prevScore: any;
    tournament?: { tournamentId: string; groupId: string };
}) => {
    let prefix = "";
    if (tournament) {
        prefix = `tournaments/${tournament.tournamentId}/group/${tournament.groupId}/`;
    }
    const tournamentsRef = ref(database, `${prefix}matches/${id}/score/sets`);

    update(tournamentsRef, {
        [gem]: {
            ...prevScore,
            [team]: score,
        },
    });
};

export const updateTieScore = async ({
    id,
    prevScore,
    team,
    score,
    tournament,
}: {
    id: string;
    prevScore: number[];
    team: number;
    score: number;
    tournament?: { tournamentId: string; groupId: string };
}) => {
    let prefix = "";
    if (tournament) {
        prefix = `tournaments/${tournament.tournamentId}/group/${tournament.groupId}/`;
    }
    const tournamentsRef = ref(database, `${prefix}matches/${id}/score`);

    update(tournamentsRef, {
        tiebreak: {
            ...prevScore,
            [team]: score,
        },
    });
};

export const updateMatchStatus = async ({
    id,
    status,
    tournament,
}: {
    id: string;
    status: { id: number; status: string };
    tournament?: { tournamentId: string; groupId: string };
}) => {
    let prefix = "";
    if (tournament) {
        prefix = `tournaments/${tournament.tournamentId}/group/${tournament.groupId}/`;
    }
    const tournamentsRef = ref(database, `${prefix}matches/${id}/status`);

    update(tournamentsRef, {
        id: status.id,
        status: status.status,
    });
};

export const updateServingPlayer = async ({
    gameId,
    team,
    playerId,
    isServing,
    tournament,
}: any) => {
    let prefix = "";
    if (tournament) {
        prefix = `tournaments/${tournament.tournamentId}/group/${tournament.groupId}/`;
    }
    const tournamentsRef = ref(database, `${prefix}matches/${gameId}/players/${team}/${playerId}`);

    update(tournamentsRef, {
        serving: isServing,
    });
};

export const updateMatchWinner = async ({
    gameId,
    winner,
    tournament,
}: {
    gameId: string;
    winner: string;
    tournament?: { tournamentId: string; groupId: string };
}) => {
    let prefix = "";
    if (tournament) {
        prefix = `tournaments/${tournament.tournamentId}/group/${tournament.groupId}/`;
    }
    const tournamentsRef = ref(database, `${prefix}matches/${gameId}`);

    return update(tournamentsRef, {
        winner,
    });
};
