import { database } from "@/lib/firebaseConfig";
import { get, push, ref, remove, update } from "firebase/database";

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
  update(ref(database, `tournaments/${id}${path}`), {
    [team]: Math.floor(Math.random() * 100),
  });
};

export const updateCurrentSetScore = async ({ team, id, path, score }: any) => {
  update(ref(database, `tournaments/${id}${path}`), {
    [team]: score,
  });
};

export const updateGemScore = async ({
  id,
  path,
  gem,
  team,
  score,
  prevScore,
}: {
  id: string;
  path?: string;
  gem: number;
  team: string;
  score: number;
  prevScore: any;
}) => {
  update(ref(database, `tournaments/${id}/score/sets`), {
    [gem]: {
      ...prevScore,
      [team]: score,
    },
  });
};

export const updateMatchStatus = async ({
  id,
  status,
}: {
  id: string;
  status: { id: number; status: string };
}) => {
  update(ref(database, `tournaments/${id}/status`), {
    id: status.id,
    status: status.status,
  });
};
