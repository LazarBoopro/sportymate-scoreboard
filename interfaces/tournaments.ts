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
    player2?: PlayerType;
};

export type ObjectType<T> = {
    [key: string]: T;
};

export type CreateGroupType = {
    teams: TeamType[];
    double: boolean;
    superTieBreak: boolean;
    goldenPoint: boolean;
    type: MatchTypeEnum;
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
            A: GroupType;
        };
        "round-of-16": {
            A: GroupType;
        };
        "semi-final": {
            A: GroupType;
        };
        final: {
            A: GroupType;
        };
    };
    teams: {
        [teamId: string]: TeamType;
    };
};
