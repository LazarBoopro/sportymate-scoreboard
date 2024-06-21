export type TournamentType = {
  id: string;
  userId: string;
  title: string;
  status: string;
  startTime: string;
  players: {
    host: PlayerType[];
    guest: PlayerType[];
  };
  result?: GameSetType | null;
};

export type PlayerType = {
  firstName: string;
  lastName: string;
  isServing?: boolean;
};

// export type TeamType = {
//   // gems: number;
//   // sets: number;
//    PlayerType[];
// };

type GameSetType = {
  [key: number]: {
    host: number;
    guest: number;
  };
};
