import { GroupType } from "@/interfaces/tournaments";
import { database } from "@/lib/firebaseConfig";
import { child, get, ref, remove, set, update } from "firebase/database";

export const addGroup = (
  data: GroupType,
  tournamentId: string,
  groupId: string,
  phase: string
) => {
  const group = ref(database, `tournaments/${tournamentId}/matches/${phase}`);
  const customGroupRef = child(group, groupId);
  return set(customGroupRef, data);
  // return push(group, data);
};

export const deleteGroup = (
  tournamentId: string,
  groupId: string,
  phase: string
) => {
  const groupsRef = ref(
    database,
    `tournaments/${tournamentId}/matches/${phase}/${groupId}`
  );

  return remove(groupsRef);
};

export const getGroups = async (tournamentId: string, phase: string) => {
  const groupsRef = ref(
    database,
    `tournaments/${tournamentId}/matches/${phase}`
  );

  const snapshot = await get(groupsRef);
  if (snapshot.exists()) {
    return snapshot.val();
  } else {
    throw new Error("Game not found");
  }
};

export const getSingleGroup = async (tournamentId: string, groupId: string) => {
  const groupsRef = ref(
    database,
    `tournaments/${tournamentId}/group/${groupId}`
  );

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
  data: { wins: number; losses: number };
  teamIndex: number;
}) => {
  update(
    ref(
      database,
      `tournaments/${tournamentId}/matches/${phase}/${groupId}/teams/${teamIndex}`
    ),
    data
  );
};
