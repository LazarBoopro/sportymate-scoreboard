import { database } from "@/lib/firebaseConfig";
import { child, get, push, ref, remove, set, update } from "firebase/database";

export const addTournament = (data: any) => {
    const tournametsRef = ref(database, "tournaments");

    return push(tournametsRef, data);
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
    team,
}: {
    id: string;
    data: any;
    path: string;
    team?: any;
}) => {
    update(ref(database, `tournaments/${id}${path}`), data);
};

export const addGroup = (data: any, tournamentId: string, groupId: string, phase: string) => {
    const group = ref(database, `tournaments/${tournamentId}/matches/${phase}`);
    const customGroupRef = child(group, groupId);
    return set(customGroupRef, data);
    // return push(group, data);
};

export const deleteGroup = (tournamentId: string, groupId: string, phase: string) => {
    const groupsRef = ref(database, `tournaments/${tournamentId}/matches/${phase}/${groupId}`);

    return remove(groupsRef);
};

export const getGroups = async (tournamentId: string, phase: string) => {
    const groupsRef = ref(database, `tournaments/${tournamentId}/matches/${phase}`);

    const snapshot = await get(groupsRef);
    if (snapshot.exists()) {
        return snapshot.val();
    } else {
        throw new Error("Game not found");
    }
};

export const getSingleGroup = async (tournamentId: string, groupId: string) => {
    const groupsRef = ref(database, `tournaments/${tournamentId}/group/${groupId}`);

    const snapshot = await get(groupsRef);
    if (snapshot.exists()) {
        return snapshot.val();
    } else {
        throw new Error("Game not found");
    }
};

export const updateGroupPoints = async ({
    tournamentId,
    groupId,
    phase,
    data,
    teamIndex,
}: {
    tournamentId: string;
    groupId: string;
    phase: string;
    data?: any;
    teamIndex: number;
}) => {
    update(
        ref(database, `tournaments/${tournamentId}/matches/${phase}/${groupId}/teams/${teamIndex}`),
        data
    );
};

export const addTeam = (tournamentId: string, data: any) => {
    const teamRef = ref(database, `tournaments/${tournamentId}/teams`);

    return push(teamRef, data);
};

export const deleteTeam = (tournamentId: string, teamId: string) => {
    const teamsRef = ref(database, `tournaments/${tournamentId}/teams/${teamId}`);

    return remove(teamsRef);
};

export const updateTeam = async ({
    tournamentId,
    teamId,
    data,
}: {
    tournamentId: string;
    teamId: string;
    data?: any;
}) => {
    update(ref(database, `tournaments/${tournamentId}/teams/${teamId}`), data);
};

export const getTeams = async (tournamentId: string) => {
    const groupsRef = ref(database, `tournaments/${tournamentId}/teams`);

    const snapshot = await get(groupsRef);
    if (snapshot.exists()) {
        return snapshot.val();
    } else {
        throw new Error("Game not found");
    }
};
