// types.ts

export type Player = {
  playerId: number | null;
  name: string;
};

export type Throws = {
  throwId: number;
  playerId: Player;
  teamId: number;
  legId: number;
  score: number;
  remainingScore: number;
};

export type Team = {
  teamId: number;
  name: string;
  players: Player[];
  currentPlayerIndex: number;
  wins: number;
};

export type Leg = {
  legId: number;
  winnerTeamId: number | null;
  legScoreHistory: Throws[];
  isFinished: boolean;
  thrownDartsToCheckOut: number | null;
};

export type MatchSettings = {
  mode: "First to" | "Best of";
  startingScore: number;
  legs: number;
  maxLeg: number;
  doubleOut: boolean;
  randomStartingTeam: boolean;
  randomStartingPlayer: boolean;
};

export type Match = {
  teams: Team[];
  legs: Leg[];
  currentTeamIndex: number;
  currentLegIndex: number;
  matchSettings: MatchSettings;
  isOver: boolean;
  winnerTeamIndex: number | undefined;
};
