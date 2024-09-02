import { MatchTypeEnum } from "./enums";
import { MatchType, PlayerType } from "./matches";

export type TournamentQueryParams = {
  tournamentId: string;
  groupId: string;
  phase: string;
};

export type TeamType = {
  losses?: number;
  wins?: number;
  teamId?: string;
  player1: PlayerType;
  player2: PlayerType;
};

export type GroupType = {
  double: boolean;
  goldenPoint: boolean;
  name: string;
  superTieBreak: boolean;
  type: MatchTypeEnum;
  teams: TeamType[];
  matches?: {
    [matchId: string]: MatchType;
  };
};

export type TournamentType = {
  title: string;
  matches: {
    groups: {
      [groupId: string]: GroupType;
    };
    "quarter-finals": {
      [groupId: string]: GroupType;
    };
    "round-of-16": {
      [groupId: string]: GroupType;
    };
    "semi-final": {
      [groupId: string]: GroupType;
    };
    final: {
      [groupId: string]: GroupType;
    };
  };
  teams: {
    [teamId: string]: TeamType;
  };
};
