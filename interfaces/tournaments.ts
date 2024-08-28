import { MatchType } from "./matches";

export type TournamentType = {
    id?: string;
    userId?: string;
    title: string;

    teams: {
        [key: string]: { firstName: string; lastName: string }[];
    };

    matches: {
        faza: {
            [key: string]: {
                matches: MatchType[];
                teams: {
                    [key: string]: {
                        firstName: string;
                        lastName: string;
                        wins: number;
                        teamId: string;
                    }[];
                };
            };
        };
        // osmina:{}
        // cetvrtina: {}
        // polufinale: {}
        // finale:{}
    };

    // groups: {
    //     [key: string]: {
    //         matches: MatchType[];
    //         teams: {
    //             [key: string]: {
    //                 firstName: string;
    //                 lastName: string;
    //                 wins: number;
    //                 teamId: string;
    //             }[];
    //         };
    //     };
    // };
};

export type PlayerType = {
    firstName: string;
    lastName: string;
    serving?: boolean;
};
