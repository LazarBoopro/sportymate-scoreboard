import { TournamentType } from "@/interfaces/tournaments";
import { database } from "@/lib/firebaseConfig";
import { child, get, push, ref, remove, set, update } from "firebase/database";

export const addTournament = (data: { title: string }) => {
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
}: {
  id: string;
  data: TournamentType;
  path: string;
}) => {
  console.log("UPDATE TOURNAMENT");
  update(ref(database, `tournaments/${id}${path}`), data);
};
