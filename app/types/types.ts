// types.ts

export type Player = {
  playerId: number | null;
  name: string;
};

export type Throw = {
  throwId: number;
  playerId: Player;
  teamId: number;
  legId: number;
  score: number;
  remainingScore: number;
  thrownDartsToCheckOut: number;
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
  legScoreHistory: Throw[];
  isFinished: boolean;
  thrownDartsToCheckOut: number | null;
};

export type MatchSettings = {
  mode: "First to" | "Best of";
  startingScore: number;
  legs: number;
  maxLeg: number;
  checkOutMode: CheckOutMode;
  randomStartingTeam: boolean;
  randomStartingPlayer: boolean;
  badgeMode: boolean;
};

export type Match = {
  matchId: number;
  teams: Team[];
  legs: Leg[];
  currentTeamIndex: number;
  currentLegIndex: number;
  matchSettings: MatchSettings;
  isOver: boolean;
  winnerTeamIndex: number | undefined;
};

export type CheckOutMode = 'Simple' | 'Double' | 'Triple';

export type CheckOutThrow = {
  checkOut: [],
}

export type Dart = {
  value: number;
  type: CheckOutMode;
  label: string;
}

export type CheckOutDart = {
  dart: string[];
}

export type CheckOut = {
  remainingScore: number;
  dart: CheckOutDart;
  isValid: boolean;
}

export type ScoreHistory = 'Leg' | 'Match';

export type SavedMatch = {
  match: Match;
  name: string;
}