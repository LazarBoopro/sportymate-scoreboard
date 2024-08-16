import { TournamentTypeService } from "@/interfaces/tournaments";
import { database } from "@/lib/firebaseConfig";
import { get, push, ref, remove, update } from "firebase/database";

export const addTournament = (data: TournamentTypeService) => {
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
  update(ref(database, `tournaments/${id}/score/currentSet`), {
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
  update(ref(database, `tournaments/${id}/score/sets`), {
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
  update(ref(database, `tournaments/${id}/score`), {
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
  update(ref(database, `tournaments/${id}/status`), {
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
  update(ref(database, `tournaments/${gameId}/players/${team}/${playerId}`), {
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
  return update(ref(database, `tournaments/${gameId}`), {
    winner,
  });
};
// export const updateMatchWinner = async ({
//   gameId,
//   winner,
// }: {
//   gameId: string;
//   winner: number;
// }) => {
//   console.log(gameId, winner);
//   update(ref(database, `tournaments/${gameId}`), {
//     winner,
//   });
// };
