export type TournamentType = {
  id: string;
  userId: string;
  title: string;
  status: {
    id: number;
    status: string;
  };
  startTime: string;
  players: {
    host: PlayerType[];
    guest: PlayerType[];
  };
  score: {
    currentSet: number[];
    sets: {
      [key: string]: number;
    }[];
    // sets: {
    //   host: number;
    //   guest: number;
    // }[];
  };
};

export type PlayerType = {
  firstName: string;
  lastName: string;
  isServing?: boolean;
};
