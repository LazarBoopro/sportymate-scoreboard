import { MatchTypeService } from "@/interfaces/tournaments";
import { database } from "@/lib/firebaseConfig";
import { get, push, ref, remove, update } from "firebase/database";

export const addTournament = (data: MatchTypeService) => {
  const tournamentsRef = ref(database, "matches");

  return push(tournamentsRef, data);
};

export const deleteTournament = (id: string) => {
  const tournamentsRef = ref(database, `matches/${id}`);

  return remove(tournamentsRef);
};

export const getSingleTournament = async (id: string) => {
  const tournamentsRef = ref(database, `matches/${id}`);

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
  update(ref(database, `matches/${id}${path}`), {
    [team]: Math.floor(Math.random() * 100),
  });
};

export const updateCurrentSetScore = async ({ team, id, path, score }: any) => {
  update(ref(database, `matches/${id}/score/currentSet`), {
    [team]: score,
  });
};

export const updateGemScore = async ({
  id,
  gem,
  team,
  score,
  prevScore,
}: {
  id: string;
  gem: number;
  team: string;
  score: number;
  prevScore: any;
}) => {
  update(ref(database, `matches/${id}/score/sets`), {
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
}: {
  id: string;
  prevScore: number[];
  team: number;
  score: number;
}) => {
  update(ref(database, `matches/${id}/score`), {
    tiebreak: {
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
  update(ref(database, `matches/${id}/status`), {
    id: status.id,
    status: status.status,
  });
};

export const updateServingPlayer = async ({
  gameId,
  team,
  playerId,
  isServing,
}: any) => {
  update(ref(database, `matches/${gameId}/players/${team}/${playerId}`), {
    serving: isServing,
  });
};

export const updateMatchWinner = async ({
  gameId,
  winner,
}: {
  gameId: string;
  winner: string;
}) => {
  return update(ref(database, `matches/${gameId}`), {
    winner,
  });
};
