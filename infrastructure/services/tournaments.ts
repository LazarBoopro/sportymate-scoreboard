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

export const updateGroup = async ({
    tournamentId,
    groupId,
    path,
    data,
}: {
    tournamentId: string;
    groupId: string;
    path: string;
    data?: any;
}) => {
    update(ref(database, `tournaments/${tournamentId}/group/${groupId}${path}`), data);
};

export const addTeam = (tournamentId: string, data: any) => {
    const teamRef = ref(database, `tournaments/${tournamentId}/teams`);

    return push(teamRef, data);
};

export const deleteTeam = (tournamentId: string, teamId: string) => {
    const teamsRef = ref(database, `tournaments/${tournamentId}/teams/${teamId}`);

    return remove(teamsRef);
};
