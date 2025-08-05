import React, { FC } from "react";
import { Team } from "../types/types";
import useMatch from "../hooks/MatchProvider";

interface TeamStatisticsProps {
  team: Team;
}

const TeamStatistics: FC<TeamStatisticsProps> = ({ team }) => {
  const { CalculateLegAvg, CalculateMatchAvg } = useMatch();

  const legAvg = CalculateLegAvg(team.teamId);
  const matchAvg = CalculateMatchAvg(team.teamId);
  const wins = team.wins;

  const a = 3;
  const b = 3;
  const c = 3;

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="w-full flex gap-2">
        <div className="flex-1/3 flex-col justify-center items-center bg-gray-800/20 p-3 rounded-md text-center text-lg font-bold">
          <p>Wins: </p>
          <p>{wins}</p>
        </div>
        <div className="flex-1/3 flex-col justify-center items-center bg-gray-800/20 p-3 rounded-md text-center text-lg font-bold">
          <p>Legs Avg: </p>
          <p>{legAvg}</p>
        </div>
        <div className="flex-1/3 flex-col justify-center items-center bg-gray-800/20 p-3 rounded-md text-center text-lg font-bold">
          <p>Match Avg: </p>
          <p>{matchAvg}</p>
        </div>
      </div>
      <div className="w-full flex gap-2">
        <div className="flex-1/3 flex gap-2 justify-center items-center bg-gray-800/20 p-2 rounded-md text-center text-md font-bold">
          <p>180: </p>
          <p>{a}</p>
        </div>
        <div className="flex-1/3 flex gap-2 justify-center items-center bg-gray-800/20 p-2 rounded-md text-center text-md font-bold">
          120+: {b}
        </div>
        <div className="flex-1/3 flex gap-2 justify-center items-center bg-gray-800/20 p-2 rounded-md text-center text-md font-bold">
          60+: {c}
        </div>
      </div>
    </div>
  );
};

export default TeamStatistics;
