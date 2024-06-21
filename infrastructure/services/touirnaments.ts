import { database } from "@/lib/firebaseConfig";
import { push, ref, remove } from "firebase/database";

export const addTournament = (data: any) => {
  const tournamentsRef = ref(database, "tournaments");

  return push(tournamentsRef, data);
};

export const deleteTournament = (id: string) => {
  const tournamentsRef = ref(database, `tournaments/${id}`);

  return remove(tournamentsRef);
};
