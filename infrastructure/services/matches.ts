import { MatchType } from "@/interfaces/matches";
import { TournamentQueryParams } from "@/interfaces/tournaments";
import { database } from "@/lib/firebaseConfig";
import { get, push, ref, remove, update } from "firebase/database";

export const addMatch = (
  data: MatchType & { tournament?: TournamentQueryParams }
  // tournament?: TournamentQueryParams
) => {
  let prefix = "";
  const tournament = data.tournament;
  if (tournament) {
    prefix = `tournaments/${tournament.tournamentId}/matches/${tournament.phase}/${tournament.groupId}/`;
  }
  const tournamentsRef = ref(database, `${prefix}matches`);

  delete data.tournament;
  return push(tournamentsRef, data);
};

export const deleteMatch = (id: string, tournament?: TournamentQueryParams) => {
  let prefix = "";
  if (tournament) {
    prefix = `tournaments/${tournament.tournamentId}/matches/${tournament.phase}/${tournament.groupId}/`;
  }
  const tournamentsRef = ref(database, `${prefix}matches/${id}`);

  return remove(tournamentsRef);
};

export const getSingleMatch = async (
  id: string,
  tournament?: TournamentQueryParams
) => {
  let prefix = "";
  if (tournament) {
    prefix = `tournaments/${tournament.tournamentId}/matches/${tournament.phase}/${tournament.groupId}/`;
  }
  const tournamentsRef = ref(database, `${prefix}matches/${id}`);

  const snapshot = await get(tournamentsRef);
  if (snapshot.exists()) {
    return snapshot.val();
  } else {
    throw new Error("Game not found");
  }
};

export const updateCurrentSetScore = async ({
  team,
  id,
  score,
  tournament,
}: {
  id: string;
  team: string;
  score: number;
  tournament?: TournamentQueryParams;
}) => {
  let prefix = "";
  if (tournament) {
    prefix = `tournaments/${tournament.tournamentId}/matches/${tournament.phase}/${tournament.groupId}/`;
  }
  const tournamentsRef = ref(
    database,
    `${prefix}matches/${id}/score/currentSet`
  );

  update(tournamentsRef, {
    [team]: score,
  });
};

export const updateGemScore = async ({
  id,
  gem,
  team,
  score,
  prevScore,
  tournament,
}: {
  id: string;
  gem: number;
  team: string;
  score: number;
  prevScore?: number[];
  tournament?: TournamentQueryParams;
}) => {
  let prefix = "";
  if (tournament) {
    prefix = `tournaments/${tournament.tournamentId}/matches/${tournament.phase}/${tournament.groupId}/`;
  }
  const tournamentsRef = ref(database, `${prefix}matches/${id}/score/sets`);

  update(tournamentsRef, {
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
  tournament,
}: {
  id: string;
  prevScore: number[];
  team: number;
  score: number;
  tournament?: TournamentQueryParams;
}) => {
  let prefix = "";
  if (tournament) {
    prefix = `tournaments/${tournament.tournamentId}/matches/${tournament.phase}/${tournament.groupId}/`;
  }
  const tournamentsRef = ref(database, `${prefix}matches/${id}/score`);

  update(tournamentsRef, {
    tiebreak: {
      ...prevScore,
      [team]: score,
    },
  });
};

export const updateMatchStatus = async ({
  id,
  status,
  tournament,
}: {
  id: string;
  status: { id: number; status: string };
  tournament?: TournamentQueryParams;
}) => {
  let prefix = "";
  if (tournament) {
    prefix = `tournaments/${tournament.tournamentId}/matches/${tournament.phase}/${tournament.groupId}/`;
  }

  const tournamentsRef = ref(database, `${prefix}matches/${id}/status`);

  update(tournamentsRef, {
    id: status.id,
    status: status.status,
  });
};

export const updateServingPlayer = async ({
  gameId,
  team,
  playerId,
  isServing,
  tournament,
}: {
  gameId: string;
  team: string;
  playerId: string;
  isServing: boolean;
  tournament?: TournamentQueryParams;
}) => {
  let prefix = "";
  if (tournament) {
    prefix = `tournaments/${tournament.tournamentId}/matches/${tournament.phase}/${tournament.groupId}/`;
  }
  const tournamentsRef = ref(
    database,
    `${prefix}matches/${gameId}/players/${team}/${playerId}`
  );

  update(tournamentsRef, {
    serving: isServing,
  });
};

export const updateMatchWinner = async ({
  gameId,
  winner,
  tournament,
}: {
  gameId: string;
  winner: string | null;
  tournament?: TournamentQueryParams;
}) => {
  let prefix = "";
  if (tournament) {
    prefix = `tournaments/${tournament.tournamentId}/matches/${tournament.phase}/${tournament.groupId}/`;
  }
  const tournamentsRef = ref(database, `${prefix}matches/${gameId}`);

  return update(tournamentsRef, {
    winner,
  });
};
