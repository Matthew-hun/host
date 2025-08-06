// src/context/MatchContext.tsx
"use client";
import React, { createContext, useContext, useState } from "react";
import {
  CheckOut,
  CheckOutDart,
  CheckOutMode,
  CheckOutThrow,
  Dart,
  Leg,
  Match,
  Player,
  ScoreHistory,
  Team,
  Throw,
} from "../types/types";

type MatchContextType = {
  match: Match | null;
  setMatch: (match: Match) => void;
  isRunning: boolean;
  setIsRunning: (value: boolean) => void;
};

type Mode = "First to" | "Best of";

const MatchContext = createContext<MatchContextType | undefined>(undefined);

export const MatchProvider = ({ children }: { children: React.ReactNode }) => {
  const [match, setMatch] = useState<Match | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  return (
    <MatchContext.Provider value={{ match, setMatch, isRunning, setIsRunning }}>
      {children}
    </MatchContext.Provider>
  );
};

export default function useMatch() {
  const context = useContext(MatchContext);
  if (!context) {
    throw new Error("useMatch must be used within a MatchProvider");
  }

  const checkoutTable: CheckOut[] = [
    {
      remainingScore: 170,
      dart: { dart: ["T20", "T20", "BIKE"] },
      isValid: false,
    },
    { remainingScore: 169, dart: { dart: [] }, isValid: false },
    { remainingScore: 168, dart: { dart: [] }, isValid: false },
    {
      remainingScore: 167,
      dart: { dart: ["T20", "T19", "BIKE"] },
      isValid: false,
    },
    { remainingScore: 166, dart: { dart: [] }, isValid: false },
    { remainingScore: 165, dart: { dart: [] }, isValid: false },
    {
      remainingScore: 164,
      dart: { dart: ["T20", "T18", "BIKE"] },
      isValid: false,
    },
    { remainingScore: 163, dart: { dart: [] }, isValid: false },
    { remainingScore: 162, dart: { dart: [] }, isValid: false },
    {
      remainingScore: 161,
      dart: { dart: ["T20", "T17", "BIKE"] },
      isValid: false,
    },
    {
      remainingScore: 160,
      dart: { dart: ["T20", "T20", "D20"] },
      isValid: true,
    },
    { remainingScore: 159, dart: { dart: [] }, isValid: false },
    {
      remainingScore: 158,
      dart: { dart: ["T20", "T20", "D19"] },
      isValid: true,
    },
    {
      remainingScore: 157,
      dart: { dart: ["T20", "T19", "D20"] },
      isValid: true,
    },
    {
      remainingScore: 156,
      dart: { dart: ["T20", "T20", "D18"] },
      isValid: true,
    },
    {
      remainingScore: 155,
      dart: { dart: ["T20", "T19", "D19"] },
      isValid: true,
    },
    {
      remainingScore: 154,
      dart: { dart: ["T20", "T18", "D20"] },
      isValid: true,
    },
    {
      remainingScore: 153,
      dart: { dart: ["T20", "T19", "D18"] },
      isValid: true,
    },
    {
      remainingScore: 152,
      dart: { dart: ["T20", "T20", "D16"] },
      isValid: true,
    },
    {
      remainingScore: 151,
      dart: { dart: ["T20", "T17", "D20"] },
      isValid: true,
    },
    {
      remainingScore: 150,
      dart: { dart: ["T20", "T18", "D18"] },
      isValid: true,
    },
    {
      remainingScore: 149,
      dart: { dart: ["T20", "T19", "D16"] },
      isValid: true,
    },
    {
      remainingScore: 148,
      dart: { dart: ["T20", "T16", "D20"] },
      isValid: true,
    },
    {
      remainingScore: 147,
      dart: { dart: ["T20", "T17", "D18"] },
      isValid: true,
    },
    {
      remainingScore: 146,
      dart: { dart: ["T20", "T18", "D16"] },
      isValid: true,
    },
    {
      remainingScore: 145,
      dart: { dart: ["T20", "T15", "D20"] },
      isValid: true,
    },
    {
      remainingScore: 144,
      dart: { dart: ["T20", "T20", "D12"] },
      isValid: true,
    },
    {
      remainingScore: 143,
      dart: { dart: ["T20", "T17", "D16"] },
      isValid: true,
    },
    {
      remainingScore: 142,
      dart: { dart: ["T20", "T14", "D20"] },
      isValid: true,
    },
    {
      remainingScore: 141,
      dart: { dart: ["T20", "T19", "D12"] },
      isValid: true,
    },
    {
      remainingScore: 140,
      dart: { dart: ["T20", "T16", "D16"] },
      isValid: true,
    },
    {
      remainingScore: 139,
      dart: { dart: ["T19", "T14", "D20"] },
      isValid: true,
    },
    {
      remainingScore: 138,
      dart: { dart: ["T20", "T18", "D12"] },
      isValid: true,
    },
    {
      remainingScore: 137,
      dart: { dart: ["T19", "T16", "D16"] },
      isValid: true,
    },
    {
      remainingScore: 136,
      dart: { dart: ["T20", "T20", "D8"] },
      isValid: true,
    },
    {
      remainingScore: 135,
      dart: { dart: ["T20", "T17", "D12"] },
      isValid: true,
    },
    {
      remainingScore: 134,
      dart: { dart: ["T20", "T14", "D16"] },
      isValid: true,
    },
    {
      remainingScore: 133,
      dart: { dart: ["T20", "T19", "D8"] },
      isValid: true,
    },
    {
      remainingScore: 132,
      dart: { dart: ["T20", "T16", "D12"] },
      isValid: true,
    },
    {
      remainingScore: 131,
      dart: { dart: ["T20", "T13", "D16"] },
      isValid: true,
    },
    {
      remainingScore: 130,
      dart: { dart: ["T20", "T20", "D5"] },
      isValid: true,
    },
    {
      remainingScore: 129,
      dart: { dart: ["T19", "T16", "D12"] },
      isValid: true,
    },
    {
      remainingScore: 128,
      dart: { dart: ["T18", "T14", "D16"] },
      isValid: true,
    },
    {
      remainingScore: 127,
      dart: { dart: ["T20", "T17", "D8"] },
      isValid: true,
    },
    {
      remainingScore: 126,
      dart: { dart: ["T19", "T19", "D6"] },
      isValid: true,
    },
    {
      remainingScore: 125,
      dart: { dart: ["25", "T20", "D20"] },
      isValid: true,
    },
    {
      remainingScore: 124,
      dart: { dart: ["T20", "T16", "D8"] },
      isValid: true,
    },
    {
      remainingScore: 123,
      dart: { dart: ["T19", "T16", "D9"] },
      isValid: true,
    },
    {
      remainingScore: 122,
      dart: { dart: ["T18", "T20", "D4"] },
      isValid: true,
    },
    {
      remainingScore: 121,
      dart: { dart: ["T17", "T10", "D20"] },
      isValid: true,
    },
    {
      remainingScore: 120,
      dart: { dart: ["T20", "20", "D20"] },
      isValid: true,
    },
    {
      remainingScore: 119,
      dart: { dart: ["T19", "T10", "D16"] },
      isValid: true,
    },
    {
      remainingScore: 118,
      dart: { dart: ["T20", "18", "D20"] },
      isValid: true,
    },
    {
      remainingScore: 117,
      dart: { dart: ["T20", "17", "D20"] },
      isValid: true,
    },
    {
      remainingScore: 116,
      dart: { dart: ["T20", "16", "D20"] },
      isValid: true,
    },
    {
      remainingScore: 115,
      dart: { dart: ["T20", "15", "D20"] },
      isValid: true,
    },
    {
      remainingScore: 114,
      dart: { dart: ["T20", "14", "D20"] },
      isValid: true,
    },
    {
      remainingScore: 113,
      dart: { dart: ["T20", "13", "D20"] },
      isValid: true,
    },
    {
      remainingScore: 112,
      dart: { dart: ["T20", "12", "D20"] },
      isValid: true,
    },
    {
      remainingScore: 111,
      dart: { dart: ["T20", "19", "D16"] },
      isValid: true,
    },
    {
      remainingScore: 110,
      dart: { dart: ["T20", "18", "D16"] },
      isValid: true,
    },
    {
      remainingScore: 109,
      dart: { dart: ["T19", "20", "D16"] },
      isValid: true,
    },
    {
      remainingScore: 108,
      dart: { dart: ["T20", "16", "D16"] },
      isValid: true,
    },
    {
      remainingScore: 107,
      dart: { dart: ["T19", "18", "D16"] },
      isValid: true,
    },
    {
      remainingScore: 106,
      dart: { dart: ["T20", "14", "D16"] },
      isValid: true,
    },
    {
      remainingScore: 105,
      dart: { dart: ["T19", "16", "D16"] },
      isValid: true,
    },
    {
      remainingScore: 104,
      dart: { dart: ["T18", "18", "D16"] },
      isValid: true,
    },
    { remainingScore: 103, dart: { dart: ["T20", "3", "D20"] }, isValid: true },
    {
      remainingScore: 102,
      dart: { dart: ["T20", "10", "D16"] },
      isValid: true,
    },
    { remainingScore: 101, dart: { dart: ["T20", "1", "D20"] }, isValid: true },
    { remainingScore: 100, dart: { dart: ["T20", "D20"] }, isValid: true },
    { remainingScore: 99, dart: { dart: ["T19", "10", "D16"] }, isValid: true },
    { remainingScore: 98, dart: { dart: ["T20", "D19"] }, isValid: true },
    { remainingScore: 97, dart: { dart: ["T19", "D20"] }, isValid: true },
    { remainingScore: 96, dart: { dart: ["T20", "D18"] }, isValid: true },
    { remainingScore: 95, dart: { dart: ["T19", "D19"] }, isValid: true },
    { remainingScore: 94, dart: { dart: ["T18", "D20"] }, isValid: true },
    { remainingScore: 93, dart: { dart: ["T19", "D18"] }, isValid: true },
    { remainingScore: 92, dart: { dart: ["T20", "D16"] }, isValid: true },
    { remainingScore: 91, dart: { dart: ["T17", "D20"] }, isValid: true },
    { remainingScore: 90, dart: { dart: ["T20", "D15"] }, isValid: true },
    { remainingScore: 89, dart: { dart: ["T19", "D16"] }, isValid: true },
    { remainingScore: 88, dart: { dart: ["T16", "D20"] }, isValid: true },
    { remainingScore: 87, dart: { dart: ["T17", "D18"] }, isValid: true },
    { remainingScore: 86, dart: { dart: ["T18", "D16"] }, isValid: true },
    { remainingScore: 85, dart: { dart: ["T15", "D20"] }, isValid: true },
    { remainingScore: 84, dart: { dart: ["T20", "D12"] }, isValid: true },
    { remainingScore: 83, dart: { dart: ["T17", "D16"] }, isValid: true },
    { remainingScore: 82, dart: { dart: ["T14", "D20"] }, isValid: true },
    { remainingScore: 81, dart: { dart: ["T19", "D12"] }, isValid: true },
    { remainingScore: 80, dart: { dart: ["T20", "D10"] }, isValid: true },
    { remainingScore: 79, dart: { dart: ["T19", "D11"] }, isValid: true },
    { remainingScore: 78, dart: { dart: ["T18", "D12"] }, isValid: true },
    { remainingScore: 77, dart: { dart: ["T19", "D10"] }, isValid: true },
    { remainingScore: 76, dart: { dart: ["T20", "D8"] }, isValid: true },
    { remainingScore: 75, dart: { dart: ["T17", "D12"] }, isValid: true },
    { remainingScore: 74, dart: { dart: ["T14", "D16"] }, isValid: true },
    { remainingScore: 73, dart: { dart: ["T19", "D8"] }, isValid: true },
    { remainingScore: 72, dart: { dart: ["T16", "D12"] }, isValid: true },
    { remainingScore: 71, dart: { dart: ["T13", "D16"] }, isValid: true },
    { remainingScore: 70, dart: { dart: ["T10", "D20"] }, isValid: true },
    { remainingScore: 69, dart: { dart: ["T15", "D12"] }, isValid: true },
    { remainingScore: 68, dart: { dart: ["T20", "D4"] }, isValid: true },
    { remainingScore: 67, dart: { dart: ["T17", "D8"] }, isValid: true },
    { remainingScore: 66, dart: { dart: ["T10", "D18"] }, isValid: true },
    { remainingScore: 65, dart: { dart: ["T19", "D4"] }, isValid: true },
    { remainingScore: 64, dart: { dart: ["T16", "D8"] }, isValid: true },
    { remainingScore: 63, dart: { dart: ["T13", "D12"] }, isValid: true },
    { remainingScore: 62, dart: { dart: ["T10", "D16"] }, isValid: true },
    { remainingScore: 61, dart: { dart: ["T15", "D8"] }, isValid: true },
    { remainingScore: 60, dart: { dart: ["20", "D20"] }, isValid: true },
    { remainingScore: 59, dart: { dart: ["19", "D20"] }, isValid: true },
    { remainingScore: 58, dart: { dart: ["18", "D20"] }, isValid: true },
    { remainingScore: 57, dart: { dart: ["17", "D20"] }, isValid: true },
    { remainingScore: 56, dart: { dart: ["16", "D20"] }, isValid: true },
    { remainingScore: 55, dart: { dart: ["15", "D20"] }, isValid: true },
    { remainingScore: 54, dart: { dart: ["14", "D20"] }, isValid: true },
    { remainingScore: 53, dart: { dart: ["13", "D20"] }, isValid: true },
    { remainingScore: 52, dart: { dart: ["20", "D16"] }, isValid: true },
    { remainingScore: 51, dart: { dart: ["19", "D16"] }, isValid: true },
    { remainingScore: 50, dart: { dart: ["18", "D16"] }, isValid: true },
    { remainingScore: 50, dart: { dart: ["Bull"] }, isValid: true },
    { remainingScore: 49, dart: { dart: ["17", "D16"] }, isValid: true },
    { remainingScore: 48, dart: { dart: ["16", "D16"] }, isValid: true },
    { remainingScore: 47, dart: { dart: ["15", "D16"] }, isValid: true },
    { remainingScore: 46, dart: { dart: ["14", "D16"] }, isValid: true },
    { remainingScore: 45, dart: { dart: ["13", "D16"] }, isValid: true },
    { remainingScore: 44, dart: { dart: ["12", "D16"] }, isValid: true },
    { remainingScore: 43, dart: { dart: ["11", "D16"] }, isValid: true },
    { remainingScore: 42, dart: { dart: ["10", "D16"] }, isValid: true },
    { remainingScore: 41, dart: { dart: ["9", "D16"] }, isValid: true },
    { remainingScore: 40, dart: { dart: ["D20"] }, isValid: true },
    { remainingScore: 39, dart: { dart: ["S7", "D16"] }, isValid: true },
    { remainingScore: 38, dart: { dart: ["D19"] }, isValid: true },
    { remainingScore: 37, dart: { dart: ["S5", "D16"] }, isValid: true },
    { remainingScore: 36, dart: { dart: ["D18"] }, isValid: true },
    { remainingScore: 35, dart: { dart: ["S3", "D16"] }, isValid: true },
    { remainingScore: 34, dart: { dart: ["D17"] }, isValid: true },
    { remainingScore: 33, dart: { dart: ["S1", "D16"] }, isValid: true },
    { remainingScore: 32, dart: { dart: ["D16"] }, isValid: true },
    { remainingScore: 31, dart: { dart: ["S15", "D8"] }, isValid: true },
    { remainingScore: 30, dart: { dart: ["D15"] }, isValid: true },
    { remainingScore: 29, dart: { dart: ["S13", "D8"] }, isValid: true },
    { remainingScore: 28, dart: { dart: ["D14"] }, isValid: true },
    { remainingScore: 27, dart: { dart: ["S11", "D8"] }, isValid: true },
    { remainingScore: 26, dart: { dart: ["D13"] }, isValid: true },
    { remainingScore: 25, dart: { dart: ["S9", "D8"] }, isValid: true },
    { remainingScore: 24, dart: { dart: ["D12"] }, isValid: true },
    { remainingScore: 23, dart: { dart: ["S7", "D8"] }, isValid: true },
    { remainingScore: 22, dart: { dart: ["D11"] }, isValid: true },
    { remainingScore: 21, dart: { dart: ["S5", "D8"] }, isValid: true },
    { remainingScore: 20, dart: { dart: ["D10"] }, isValid: true },
    { remainingScore: 19, dart: { dart: ["S3", "D8"] }, isValid: true },
    { remainingScore: 18, dart: { dart: ["D9"] }, isValid: true },
    { remainingScore: 17, dart: { dart: ["S1", "D8"] }, isValid: true },
    { remainingScore: 16, dart: { dart: ["D8"] }, isValid: true },
    { remainingScore: 15, dart: { dart: ["S7", "D4"] }, isValid: true },
    { remainingScore: 14, dart: { dart: ["D7"] }, isValid: true },
    { remainingScore: 13, dart: { dart: ["S5", "D4"] }, isValid: true },
    { remainingScore: 12, dart: { dart: ["D6"] }, isValid: true },
    { remainingScore: 11, dart: { dart: ["S3", "D4"] }, isValid: true },
    { remainingScore: 10, dart: { dart: ["D5"] }, isValid: true },
    { remainingScore: 9, dart: { dart: ["S1", "D4"] }, isValid: true },
    { remainingScore: 8, dart: { dart: ["D4"] }, isValid: true },
    { remainingScore: 7, dart: { dart: ["S3", "D2"] }, isValid: true },
    { remainingScore: 6, dart: { dart: ["D3"] }, isValid: true },
    { remainingScore: 5, dart: { dart: ["S1", "D2"] }, isValid: true },
    { remainingScore: 4, dart: { dart: ["D2"] }, isValid: true },
    { remainingScore: 3, dart: { dart: ["S1", "D1"] }, isValid: true },
    { remainingScore: 2, dart: { dart: ["D1"] }, isValid: true },
  ];

  const { match, setMatch, isRunning, setIsRunning } = context;

  const CreateMatch = (
    teams: Team[],
    legs: number,
    mode: Mode,
    startingScore: number,
    randomStartingTeam: boolean,
    randomStartingPlayer: boolean,
    checkOutMode: CheckOutMode
  ) => {
    // Biztosítsuk, hogy a csapatok teljesen tiszták legyenek
    const cleanTeams: Team[] = teams.map((team, index) => ({
      ...team,
      teamId: index, // Biztosítsuk a helyes ID-t
      wins: 0, // Nullázzuk a győzelmeket
      currentPlayerIndex: randomStartingPlayer
        ? Math.floor(Math.random() * team.players.length)
        : 0,
    }));

    const maxLegs =
      mode === "First to"
        ? (legs - 1) * teams.length + 1 // Legrosszabb eset: minden csapat (legs-1)-et nyer, majd az egyik megnyeri a legs-ediket
        : legs; // Best of esetén pontosan legs db leg lesz

    const generatedLegs: Leg[] = Array.from(
      { length: maxLegs },
      (_, index) => ({
        legId: index,
        winnerTeamId: null,
        legScoreHistory: [],
        isFinished: false,
        thrownDartsToCheckOut: null,
      })
    );

    const newMatch: Match = {
      teams: cleanTeams,
      legs: generatedLegs,
      currentTeamIndex: randomStartingTeam
        ? Math.floor(Math.random() * cleanTeams.length)
        : 0,
      currentLegIndex: 0,
      isOver: false,
      matchSettings: {
        mode: mode,
        startingScore: startingScore,
        legs: legs,
        maxLeg: maxLegs,
        checkOutMode: checkOutMode,
        randomStartingTeam: randomStartingTeam,
        randomStartingPlayer: randomStartingPlayer,
      },
      winnerTeamIndex: undefined,
    };

    setMatch(newMatch);
    saveMatch(newMatch);
    console.log("Match created:", newMatch);
    setIsRunning(true);
  };

  const NextRound = async (inputScore: string) => {
    if (!match || match.currentLegIndex === undefined) return;

    const regex = /^(0|[1-9][0-9]{0,2})$/;
    const score = Number(inputScore);
    const remaining = GetRemainingScore(match.currentTeamIndex);

    if (!regex.test(inputScore) && inputScore !== "") {
      throw new Error("Please provide a valid score");
    } else if (score < 0 || score > 180) {
      throw new Error("Please input a score between 0 and 180");
    } else if (score === 179) {
      throw new Error("You can't score 179");
    } else if (remaining === undefined) {
      return;
    } else if (score > remaining) {
      throw new Error("You can't score more than remaining points");
    }

    const currentTeam = match.teams[match.currentTeamIndex];

    if (IsMatchOver()) {
      Over();
      return;
    }

    if (IsLegOver(score)) {
      currentTeam.wins++;

      const dobasokSzama = await GetThrownDartsToCheckOut();
      AddThrownDartsToCheckOut(dobasokSzama);

      if (IsMatchOver()) {
        saveMatch({ ...match });
        Over();
        return;
      }

      NextLeg();
    } else {
      AddScore(score);
      IncreaseTeamIndex();
    }
  };

  const IncreaseTeamIndex = () => {
    if (!match) return;
    //!IN THE END
    //?    PlayerIndex increase
    const updatedTeams: Team[] = match.teams.map((team, index) => {
      if (index === match.currentTeamIndex) {
        return {
          ...team,
          currentPlayerIndex:
            (team.currentPlayerIndex + 1) % team.players.length,
        };
      }
      return team;
    });

    //?    TeamIndex increase
    const updatedMatch: Match = {
      ...match,
      teams: updatedTeams,
      currentTeamIndex: (match.currentTeamIndex + 1) % match.teams.length,
    };

    saveMatch(updatedMatch);
  };

  const Over = () => {
    if (!match) return;

    setIsRunning(false);
    const winnerTeam = GetWinner();

    const updatedMatch: Match = {
      ...match,
      isOver: true,
      winnerTeamIndex: winnerTeam?.teamId,
    };

    setMatch(updatedMatch);
    localStorage.setItem("match", JSON.stringify(updatedMatch));
  };

  const GetWinner = (): Team | undefined => {
    switch (match?.matchSettings.mode) {
      case "First to":
        return match.teams.find((x) => x.wins == match.matchSettings.legs);
      case "Best of":
        return match.teams.reduce((max, team) =>
          team.wins > max.wins ? team : max
        );
      default:
        return undefined;
    }
  };

  const IsMatchOver = (): boolean => {
    if (!match) return false;

    switch (match.matchSettings.mode) {
      case "First to":
        // First to X esetén bármelyik csapat X leg-et ér el
        return match.teams.some(
          (team) => team.wins >= match.matchSettings.legs
        );

      case "Best of":
        const totalLegs = match.matchSettings.legs;
        const completedLegs = match.teams.reduce(
          (sum, team) => sum + team.wins,
          0
        );

        // Ha minden leg lefutott, vége
        if (completedLegs >= totalLegs) {
          return true;
        }

        // Korai befejezés: ha valaki annyit nyert, hogy már lehetetlen megelőzni
        const maxWins = Math.max(...match.teams.map((team) => team.wins));
        const remainingLegs = totalLegs - completedLegs;
        const secondMaxWins =
          match.teams.map((team) => team.wins).sort((a, b) => b - a)[1] || 0; // A második legtöbb győzelem

        // Ha a vezető annyival előrébb van, hogy a maradék legekkel sem lehet utolérni
        return maxWins > secondMaxWins + remainingLegs;

      default:
        return false;
    }
  };

  const IsLegOver = (inputScore: number): boolean => {
    if (!match) return false;
    return GetRemainingScore(match.currentTeamIndex)! - inputScore === 0;
  };

  const AddScore = (inputScore: number) => {
    if (!match || match.currentLegIndex === undefined) return;

    const currentLeg = match.legs[match.currentLegIndex];
    const currentTeam = match.teams[match.currentTeamIndex];

    const lastThrow = currentLeg.legScoreHistory
      .filter((t) => t.teamId === currentTeam.teamId)
      .at(-1);

    const previousRemaining = lastThrow
      ? lastThrow.remainingScore
      : match.matchSettings.startingScore;

    currentLeg.legScoreHistory.push({
      throwId: currentLeg.legScoreHistory.length + 1,
      playerId: currentTeam.players[currentTeam.currentPlayerIndex],
      teamId: currentTeam.teamId,
      legId: currentLeg.legId,
      score: inputScore,
      remainingScore: previousRemaining - inputScore,
    });
  };

  const NextLeg = () => {
    if (!match || match.currentLegIndex === undefined) return;

    const newLegIndex = match.currentLegIndex + 1;

    // Ellenőrizzük, hogy van-e még leg
    if (newLegIndex >= match.legs.length) {
      return;
    }

    const updatedLeg: Leg[] = match.legs.map((leg, i) => {
      if (i === match.currentLegIndex) {
        return {
          ...leg,
          isFinished: true,
        };
      }
      return leg;
    });

    const updatedMatch: Match = {
      ...match,
      legs: updatedLeg,
      currentLegIndex: newLegIndex,
      currentTeamIndex: match.matchSettings.randomStartingTeam
        ? Math.floor(Math.random() * match.teams.length)
        : (match.currentTeamIndex + 1) % match.teams.length,
      teams: match.teams.map((team) => ({
        ...team,
        currentPlayerIndex: match.matchSettings.randomStartingPlayer
          ? Math.floor(Math.random() * team.players.length)
          : 0, // Új leg-nél visszaállítjuk az első játékosra

        /*
           currentPlayerIndex:
          team.teamId === match.currentTeamIndex
            ? match.matchSettings.randomStartingPlayer
              ? Math.floor(Math.random() * team.players.length)
              : (team.currentPlayerIndex + 1) % team.players.length
            : team.currentPlayerIndex, // Csak a jelenlegi csapat játékos indexét növeljük, ha ő dob most
      })),
        */
      })),
    };

    setMatch(updatedMatch);
    saveMatch(updatedMatch);
  };

  const RemoveScore = () => {
    if (
      !match ||
      match.currentLegIndex === undefined ||
      match.legs[match.currentLegIndex].legScoreHistory.length == 0
    )
      throw new Error("Empty");

    const updatedTeamIndex =
      (match.currentTeamIndex - 1 + match.teams.length) % match.teams.length;
    const updatedLegs = [...match.legs];

    updatedLegs[match.currentLegIndex].legScoreHistory.pop();

    //?    PlayerIndex decrease
    const updatedTeams: Team[] = match.teams.map((team, index) => {
      if (index === updatedTeamIndex) {
        return {
          ...team,
          currentPlayerIndex:
            (team.currentPlayerIndex - 1 + team.players.length) %
            team.players.length,
        };
      }
      return team;
    });

    const updatedMatch: Match = {
      ...match,
      legs: updatedLegs,
      teams: updatedTeams,
      currentTeamIndex: updatedTeamIndex,
    };

    saveMatch(updatedMatch);
  };

  const SetCurrentTeamIndex = (teamIndex: number) => {
    if (!match) return;

    const updatedMatch: Match = {
      ...match,
      currentTeamIndex: teamIndex,
    };

    saveMatch(updatedMatch);
  };

  const SetCurrentPlayerIndex = (teamIndex: number, playerIndex: number) => {
    if (!match) return;

    const updatedTeam: Team[] = match.teams.map((team, idx) => {
      return idx == teamIndex
        ? {
            ...team,
            currentPlayerIndex: playerIndex,
          }
        : team;
    });

    const updatedMatch: Match = {
      ...match,
      teams: updatedTeam,
    };

    saveMatch(updatedMatch);
  };

  const CalculateMatchAvg = (teamIndex: number) => {
    if (!match || match.currentLegIndex === undefined) return;

    let totalTeamScore: number = 0;
    let totalTeamThrows: number = 0;

    match.legs.map((leg) => {
      leg.legScoreHistory.map((score) => {
        if (score.teamId == teamIndex) {
          totalTeamThrows++;
          totalTeamScore += Number(score.score);
        }
      });
    });

    return Math.round(totalTeamScore / totalTeamThrows);
  };

  const CalculateLegAvg = (teamIndex: number) => {
    if (!match || match.currentLegIndex === undefined) return;

    let totalTeamScore: number = 0;
    let totalTeamThrows: number = 0;
    match.legs[match.currentLegIndex].legScoreHistory.forEach((score) => {
      if (score.teamId == teamIndex) {
        totalTeamThrows++;
        totalTeamScore += Number(score.score);
      }
    });
    return Math.round(totalTeamScore / totalTeamThrows);
  };

  const GetScoreHistory = (teamIndex: number, historyType: ScoreHistory) => {
    if (!match || match.currentLegIndex === undefined) return;

    const currentLeg = match.currentLegIndex;

    switch (historyType) {
      case "Leg":
        return match.legs[currentLeg]?.legScoreHistory.filter(
          (x) => x.teamId == teamIndex
        );
      case "Match":
        return match.legs
          .flatMap((leg) => leg.legScoreHistory)
          .filter((x) => x.teamId == teamIndex);
      default:
        break;
    }
  };

  const GetCheckOuts = (score: number): CheckOutDart | undefined => {
    return checkoutTable.find((x) => x.remainingScore === score)?.dart;
  };

  const GetCheckOuts2 = (remainingScore: number): Set<Dart[]> => {
    if (!match) new Set<Dart[]>();
    if (remainingScore > 170) new Set<Dart[]>();

    enum types {
      Simple = "Simple",
      Double = "Double",
      Triple = "Triple",
    }

    const darts: Dart[] = [];
    darts.push({ label: "D25", value: 50, type: types.Double });
    darts.push({ label: "25", value: 25, type: types.Simple });

    for (let i = 20; i >= 1; i--) {
      darts.push({ label: `T${i}`, value: i * 3, type: types.Triple });
      darts.push({ label: `D${i}`, value: i * 2, type: types.Double });
      darts.push({ label: `${i}`, value: i, type: types.Simple });
    }

    console.log(darts);

    const results = new Set<Dart[]>();

    // One dart
    darts.forEach((d1) => {
      d1.type == match?.matchSettings.checkOutMode && d1.value == remainingScore
        ? results.add([d1])
        : null;
    });

    // Two darts
    darts.forEach((d1) =>
      darts.forEach((d2) => {
        d2.type == match?.matchSettings.checkOutMode &&
        d1.value + d2.value == remainingScore
          ? results.add([d1, d2])
          : null;
      })
    );

    // Three darts
    darts.forEach((d1) =>
      darts.forEach((d2) =>
        darts.forEach((d3) => {
          d3.type == match?.matchSettings.checkOutMode &&
          d1.value + d2.value + d3.value == remainingScore
            ? results.add([d1, d2, d3])
            : null;
        })
      )
    );

    //Change D25 to Bull
    const updatedResults = new Set<Dart[]>();
    results.forEach((combo) => {
      const updatedCombo = combo.map((dart) =>
        dart.label === "D25" ? { ...dart, label: "Bull" } : dart
      );
      updatedResults.add(updatedCombo);
    });

    return updatedResults;
  };

  const GetRemainingScore = (teamIndex: number): number => {
    if (!match || match.currentLegIndex === undefined) {
      throw new Error("Match or current leg is undefined.");
    }

    const { matchSettings, legs, currentLegIndex } = match;

    const legScoreHistory = legs[currentLegIndex].legScoreHistory;
    const totalScore = legScoreHistory
      .filter((score) => score.teamId === teamIndex)
      .reduce((sum, score) => sum + Number(score.score), 0);

    return matchSettings.startingScore - totalScore;
  };

  const saveMatch = (updated: Match) => {
    setMatch({ ...updated });
    console.log("Match saved:", updated);
    localStorage.setItem("match", JSON.stringify(updated));
  };

  const BiggestMatchScorePlayer = () => {
    if (!match) return null;

    let maxThrow: Throw | null = null;

    for (const leg of match.legs) {
      for (const throwItem of leg.legScoreHistory) {
        if (!maxThrow || throwItem.score > maxThrow.score) {
          maxThrow = throwItem;
        }
      }
    }

    return maxThrow;
  };

  const BiggestLegScorePlayer = () => {
    if (
      !match ||
      match.currentLegIndex === undefined ||
      match.legs[match.currentLegIndex].legScoreHistory.length == 0
    )
      return undefined;
    return match?.legs[match.currentLegIndex].legScoreHistory.reduce(
      (max, player) => (player.score > max.score ? player : max)
    );
  };

  const GetThrownDartsToCheckOut = async (): Promise<number> => {
    const result = prompt("Hány dobásból lett meg a leg?");
    const parsed = Number(result);
    return isNaN(parsed) ? 0 : parsed;
  };

  const AddThrownDartsToCheckOut = (value: number) => {
    if (!match) return;
    // Frissítsd a leg `thrownDartsToCheckOut` értékét
    const updatedLegs = match.legs.map((leg, idx) =>
      idx === match.currentLegIndex
        ? { ...leg, thrownDartsToCheckOut: value }
        : leg
    );

    const updatedMatch: Match = {
      ...match,
      legs: updatedLegs,
    };

    saveMatch(updatedMatch);
  };

  const GetPlayerScores = (teamIndex: number, playerIndex: number | null) => {
    if (!match || match.currentLegIndex === undefined || playerIndex === null)
      return;

    return match.legs[match.currentLegIndex].legScoreHistory.filter(
      (score) =>
        score.teamId == teamIndex && score.playerId.playerId == playerIndex
    );
  };

  const CalculateMatchMileStones = (teamIndex: number, value: number) => {
    if (!match || match.currentLegIndex === undefined) return 0;

    switch (value) {
      case 180:
        return match.legs.flatMap((leg) =>
          leg.legScoreHistory.filter(
            (score) => score.teamId === teamIndex && score.score === value
          )
        ).length;
      case 120:
        return match.legs.flatMap((leg) =>
          leg.legScoreHistory.filter(
            (score) =>
              score.teamId === teamIndex &&
              score.score >= value &&
              score.score < 180
          )
        ).length;
      case 60:
        return match.legs.flatMap((leg) =>
          leg.legScoreHistory.filter(
            (score) =>
              score.teamId === teamIndex &&
              score.score >= value &&
              score.score < 110
          )
        ).length;
      default:
        return 0;
    }
  };

  return {
    match,
    setMatch,
    isRunning,
    setIsRunning,
    CurrentTeamIndex: match?.currentTeamIndex,
    NextRound,
    SetCurrentTeamIndex,
    SetCurrentPlayerIndex,
    CalculateMatchAvg,
    CalculateLegAvg,
    CreateMatch,
    RemoveScore,
    GetScoreHistory,
    GetCheckOuts,
    GetRemainingScore,
    BiggestLegScorePlayer,
    BiggestMatchScorePlayer,
    GetThrownDartsToCheckOut,
    GetPlayerScores,
    GetWinner,
    GetCheckOuts2,
    CalculateMatchMileStones,
  };
}
