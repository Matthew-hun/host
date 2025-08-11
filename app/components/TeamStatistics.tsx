import React, { FC } from "react";
import { Team } from "../types/types";
import useMatch from "../hooks/MatchProvider";

interface TeamStatisticsProps {
  team: Team;
}

const TeamStatistics: FC<TeamStatisticsProps> = ({ team }) => {
  const { CalculateLegAvg, CalculateMatchAvg, CalculateMatchMileStones, CalculateCheckOutAvg } =
    useMatch();

  const legAvg = CalculateLegAvg(team.teamId);
  const matchAvg = CalculateMatchAvg(team.teamId);
  const wins = team.wins;

  const count_180 = CalculateMatchMileStones(team.teamId, 180);
  const count_120 = CalculateMatchMileStones(team.teamId, 120);
  const count_60 = CalculateMatchMileStones(team.teamId, 60);

  const checkOutAvg = CalculateCheckOutAvg(team.teamId)?.toFixed(2);

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
          <div className="text-center">
            <div className="text-sm uppercase tracking-wide text-gray-400 mb-1">Wins</div>
            <div className="text-3xl font-bold text-white">{wins}</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
          <div className="text-center">
            <div className="text-sm uppercase tracking-wide text-gray-400 mb-1">Leg Avg</div>
            <div className="text-3xl font-bold text-white">{isNaN(Number(legAvg)) ? 0 : legAvg}</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
          <div className="text-center">
            <div className="text-sm uppercase tracking-wide text-gray-400 mb-1">Match Avg</div>
            <div className="text-3xl font-bold text-white">{isNaN(Number(matchAvg)) ? 0 : matchAvg}</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
          <div className="text-center">
            <div className="text-sm uppercase tracking-wide text-gray-400 mb-1">Checkout</div>
            <div className="text-3xl font-bold text-white">{checkOutAvg}%</div>
          </div>
        </div>
      </div>
      <div className="w-full flex gap-4">
        <div className="flex-1/3 flex gap-2 justify-center items-center bg-gradient-to-br from-gray-800/40 to-gray-900/40 p-2 rounded-md text-center border border-gray-700/50">
          <p>60+: </p>
          <p className="text-md font-bold">{count_60}</p>
        </div>
        <div className="flex-1/3 flex gap-2 justify-center items-center bg-gradient-to-br from-gray-800/40 to-gray-900/40 p-2 rounded-md text-center border border-gray-700/50">
          <p>120+: </p>
          <p className="text-md font-bold">{count_120}</p>
        </div>
        <div className="flex-1/3 flex gap-2 justify-center items-center bg-gradient-to-br from-gray-800/40 to-gray-900/40 p-2 rounded-md text-center border border-gray-700/50">
          <p>180: </p>
          <p className="text-md font-bold">{count_180}</p>
        </div>
      </div>
    </div>
  );
};

export default TeamStatistics;

