import { TeamType } from "@/interfaces/tournaments";
import { database } from "@/lib/firebaseConfig";
import { get, push, ref, remove, update } from "firebase/database";

export const addTeam = (tournamentId: string, data: TeamType) => {
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
  data: TeamType;
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
