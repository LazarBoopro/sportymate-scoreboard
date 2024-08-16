export type TournamentType = {
  id?: string;
  userId?: string;
  title: string;
  date?: string;
  status?: {
    id: number;
    status: string;
  };
  type: number;
  superTieBreak: boolean;
  startTime: {
    hour: string;
    minute: string;
  };
  players: {
    host: PlayerType[];
    guest: PlayerType[];
  };
  score?: {
    tiebreak: number[];
    currentSet: number[];
    sets: number[][];
  };
  winner: null;
};

export type PlayerType = {
  firstName: string;
  lastName: string;
  serving?: boolean;
};

export type TournamentTypeService = {
  matchId?: number;
  userId?: string | undefined;
  title: string;
  startTime: string;
  status: {
    id: number;
    status: string;
  };
  type: number;
  superTieBreak: boolean;
  players: {
    host: PlayerType[];
    guest: PlayerType[];
  };
  score: {
    currentSet: number[];
    sets: {
      [key: string]: number;
    }[];
    tiebreak: number[];
  };
  winner: null;
};
