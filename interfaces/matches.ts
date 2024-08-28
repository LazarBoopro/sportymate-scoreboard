export type MatchType = {
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
        host: { player1: PlayerType; player2: PlayerType };
        guest: { player1: PlayerType; player2: PlayerType };
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

export type MatchTypeService = {
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
        host: { player1: PlayerType; player2: PlayerType };
        guest: { player1: PlayerType; player2: PlayerType };
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
