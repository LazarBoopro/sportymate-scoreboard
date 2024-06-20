export type TournamentType = {
  id: string;
  startTime: string;
  status: string;
  title: string;
  host: TeamType;
  guest: TeamType;
};

export type PlayerType = {
  name: string;
  lastName: string;
};

export type TeamType = {
  gems: number;
  sets: number;
  players: PlayerType[];
};
