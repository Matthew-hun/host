// src/context/MatchContext.tsx
"use client";
import React, { createContext, useContext, useState } from "react";
import { Leg, Match, Team, Throws } from "../types/types";

type MatchContextType = {
  match: Match | null;
  setMatch: (match: Match) => void;
};

type Mode = "First to" | "Best of";

const MatchContext = createContext<MatchContextType | undefined>(undefined);

export const MatchProvider = ({ children }: { children: React.ReactNode }) => {
  const [match, setMatch] = useState<Match | null>(null);

  return (
    <MatchContext.Provider value={{ match, setMatch }}>
      {children}
    </MatchContext.Provider>
  );
};

export default function useMatch() {
  const context = useContext(MatchContext);
  if (!context) {
    throw new Error("useMatch must be used within a MatchProvider");
  }

  const { match, setMatch } = context;

  const CreateMatch = (
    teams: Team[],
    legs: number,
    mode: Mode,
    startingScore: number,
    randomStartingTeam: boolean,
    randomStartingPlayer: boolean,
    doubleOut: boolean
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
        doubleOut: doubleOut,
        randomStartingTeam: randomStartingTeam,
        randomStartingPlayer: randomStartingPlayer,
      },
      winnerTeamIndex: undefined,
    };

    setMatch(newMatch);
    saveMatch(newMatch);
    console.log("Match created:", newMatch);
  };

  const NextRound = async (inputScore: string) => {
    if (!match || match.currentLegIndex === undefined) return;

    const regex = /^(0|[1-9][0-9]{0,2})$/;

    if (!regex.test(inputScore)) {
      throw new Error("Please provide a valid score");
    } else if (Number(inputScore) < 0 || Number(inputScore) > 180) {
      throw new Error("Please input a score between 0 and 180");
    } else if (Number(inputScore) === 179) {
      throw new Error("You can't score 179");
    } else if (Number(inputScore) > GetRemainingScore(match.currentTeamIndex)) {
      throw new Error("No");
    } else {
      const score = Number(inputScore) || 0;

      const currentTeam = match.teams[match.currentTeamIndex];
      const remaining = GetRemainingScore(match.currentTeamIndex);

      if (remaining === undefined) return;

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

    GetScoreHistory(match.currentTeamIndex);
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
        : 0,
      teams: match.teams.map((team) => ({
        ...team,
        currentPlayerIndex: match.matchSettings.randomStartingPlayer
          ? Math.floor(Math.random() * team.players.length)
          : 0, // Új leg-nél visszaállítjuk az első játékosra
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

  const GetScoreHistory = (teamIndex: number) => {
    if (!match || match.currentLegIndex === undefined) return;

    const currentLeg = match.currentLegIndex;
    const t = match.legs[currentLeg]?.legScoreHistory.filter(
      (x) => x.teamId == teamIndex
    );

    return t;
  };

  const GetCheckOuts = (score: number) => {
    type Dart = string; // pl. "T20", "D20", "S5", "Bull"

    if (score < 2 || score > 170) return [];

    const singles = Array.from({ length: 20 }, (_, i) => i + 1);
    const darts: Dart[] = [];

    for (const n of singles) {
      darts.push(`S${n}`);
      darts.push(`D${n}`);
      darts.push(`T${n}`);
    }

    darts.push("Bull"); // 50
    darts.push("S25"); // 25
    darts.push("D25"); // 50 (alternatív megnevezés, optional)

    const dartValue = (dart: Dart): number => {
      if (dart === "Bull" || dart === "D25") return 50;
      if (dart === "S25") return 25;
      const mult = dart[0];
      const val = parseInt(dart.slice(1));
      if (isNaN(val)) return 0;
      switch (mult) {
        case "S":
          return val;
        case "D":
          return val * 2;
        case "T":
          return val * 3;
        default:
          return 0;
      }
    };

    const isDouble = (dart: Dart) =>
      dart.startsWith("D") || dart === "Bull" || dart === "D25";

    const results: Dart[][] = [];

    // 1 dart
    for (const d1 of darts) {
      if (dartValue(d1) === score && isDouble(d1)) {
        results.push([d1]);
      }
    }

    // 2 darts
    for (const d1 of darts) {
      for (const d2 of darts) {
        const total = dartValue(d1) + dartValue(d2);
        if (total === score && isDouble(d2)) {
          results.push([d1, d2]);
        }
      }
    }

    // 3 darts
    for (const d1 of darts) {
      for (const d2 of darts) {
        for (const d3 of darts) {
          const total = dartValue(d1) + dartValue(d2) + dartValue(d3);
          if (total === score && isDouble(d3)) {
            results.push([d1, d2, d3]);
          }
        }
      }
    }

    // DUPLIKÁCIÓK ELTÁVOLÍTÁSA
    const normalizeDart = (dart: Dart): Dart =>
      dart === "Bull" ? "D25" : dart;

    const normalizeCombo = (combo: Dart[]): string =>
      combo.map(normalizeDart).join(" ");

    const seen = new Set<string>();
    const uniqueResults: Dart[][] = [];

    for (const combo of results) {
      const key = normalizeCombo(combo);
      if (!seen.has(key)) {
        seen.add(key);
        uniqueResults.push(combo);
      }
    }

    return uniqueResults;
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

  const BiggestScorePlayer = () => {
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

  return {
    match,
    setMatch,
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
    BiggestScorePlayer,
    GetThrownDartsToCheckOut,
  };
}
