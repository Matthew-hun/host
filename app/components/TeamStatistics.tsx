import React, { FC } from "react";
import { Team } from "../types/types";
import useMatch from "../hooks/MatchProvider";

interface TeamStatisticsProps {
  team: Team;
}

const TeamStatistics: FC<TeamStatisticsProps> = ({ team }) => {
  const { CalculateLegAvg, CalculateMatchAvg, CalculateMatchMileStones } =
    useMatch();

  const legAvg = CalculateLegAvg(team.teamId);
  const matchAvg = CalculateMatchAvg(team.teamId);
  const wins = team.wins;

  const count_180 = CalculateMatchMileStones(team.teamId, 180);
  const count_120 = CalculateMatchMileStones(team.teamId, 120);
  const count_60 = CalculateMatchMileStones(team.teamId, 60);

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="w-full flex gap-2">
        <div className="flex-1/3 flex-col justify-center items-center bg-gray-800/20 p-3 rounded-md text-center">
          <p>Wins: </p>
          <p className="text-md font-bold">{wins}</p>
        </div>
        <div className="flex-1/3 flex-col justify-center items-center bg-gray-800/20 p-3 rounded-md text-center">
          <p>Legs Avg: </p>
          <p className="text-md font-bold">{isNaN(Number(legAvg)) ? "NA" : legAvg}</p>
        </div>
        <div className="flex-1/3 flex-col justify-center items-center bg-gray-800/20 p-3 rounded-md text-center">
          <p>Match Avg: </p>
          <p className="text-md font-bold">{isNaN(Number(matchAvg)) ? "NA" : matchAvg}</p>
        </div>
      </div>
      <div className="w-full flex gap-2">
        <div className="flex-1/3 flex gap-2 justify-center items-center bg-gray-800/20 p-2 rounded-md text-center">
          <p>180: </p>
          <p className="text-md font-bold">{count_180}</p>
        </div>
        <div className="flex-1/3 flex gap-2 justify-center items-center bg-gray-800/20 p-2 rounded-md text-center">
          <p>120+: </p>
          <p className="text-md font-bold">{count_120}</p>
        </div>
        <div className="flex-1/3 flex gap-2 justify-center items-center bg-gray-800/20 p-2 rounded-md text-center">
          <p>60+: </p>
          <p className="text-md font-bold">{count_60}</p>
        </div>
      </div>
    </div>
  );
};

export default TeamStatistics;
