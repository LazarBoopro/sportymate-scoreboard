import { database } from "@/lib/firebaseConfig";
import { get, push, ref, remove } from "firebase/database";

export const addTournament = (data: any) => {
  const tournamentsRef = ref(database, "tournaments");

  return push(tournamentsRef, data);
};

export const deleteTournament = (id: string) => {
  const tournamentsRef = ref(database, `tournaments/${id}`);

  return remove(tournamentsRef);
};

export const getSingleTournament = async (id: string) => {
  const tournamentsRef = ref(database, `tournaments/${id}`);

  const snapshot = await get(tournamentsRef);
  if (snapshot.exists()) {
    console.log("uso", snapshot.val());
    return snapshot.val();
  } else {
    throw new Error("Game not found");
  }
};
