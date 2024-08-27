import { MatchTypeService } from "@/interfaces/tournaments";
import { database } from "@/lib/firebaseConfig";
import { get, push, ref, remove, update } from "firebase/database";

export const addTournament = (data: any) => {
  const tournametsRef = ref(database, "tournaments");

  return push(tournametsRef, data);
};
