export type TournamentType = {
  id: string;
  title: string;
  status: string;
  startTime: string;
  host: TeamType;
  guest: TeamType;
  result?: GameSetType | null;
};

export type PlayerType = {
  firstName: string;
  lastName: string;
  isServing: boolean;
};

export type TeamType = {
  // gems: number;
  // sets: number;
  players: PlayerType[];
};

type GameSetType = {
  [key: number]: {
    host: number;
    guest: number;
  };
};
