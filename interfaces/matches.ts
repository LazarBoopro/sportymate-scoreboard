import { MatchTypeEnum } from "./enums";
import { TeamType } from "./tournaments";

export type CreateGroupMatchType = {
  guest: TeamType | null;
  host: TeamType | null;
  goldenPoint: boolean;
  group: string;
  superTieBreak: boolean;
  type: MatchTypeEnum;
};

export type CreateMatchType = {
  title: string;
  date: string;
  startTime: {
    hour: string;
    minute: string;
  };
  type: MatchTypeEnum;
  superTieBreak: boolean;
  goldenPoint: boolean;

  players: {
    host: TeamType;
    guest: TeamType;
  };
  winner: null;
};

export type MatchScoreType = {
  tiebreak: number[];
  currentSet: number[];
  sets: number[][];
};

export type MatchType = {
  matchId?: string;
  userId?: string;
  title: string;

  status?: {
    id: number;
    status: string;
  };
  type: MatchTypeEnum;
  superTieBreak: boolean;
  goldenPoint: boolean;
  startTime: string;
  players: {
    host: TeamType;
    guest: TeamType;
  };
  score?: MatchScoreType;
  winner: null;
};

export type PlayerType = {
  firstName: string;
  lastName: string;
  serving?: boolean;
};

// export type MatchTypeService = {
//   matchId?: number;
//   userId?: string | undefined;
//   title: string;
//   startTime?: string;
//   status: {
//     id: number;
//     status: string;
//   };
//   type: number;
//   superTieBreak: boolean;
//   goldenPoint: boolean;
//   players: {
//     host?: { player1: PlayerType; player2?: PlayerType };
//     guest?: { player1: PlayerType; player2?: PlayerType };
//   };
//   score: {
//     currentSet: number[];
//     sets: {
//       [key: string]: number;
//     }[];
//     tiebreak: number[];
//   };
//   winner: null;
// };
