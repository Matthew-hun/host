import React, { FC } from "react";
import { Team } from "../types/types";
import useMatch from "../hooks/MatchProvider";

interface TeamStatisticsProps {
  team: Team;
  isActiveTeam: boolean;
}

const TeamStatistics: FC<TeamStatisticsProps> = ({ team, isActiveTeam }) => {
  const { CalculateLegAvg, CalculateMatchAvg, CalculateMatchMileStones, CalculateCheckOutAvg } =
    useMatch();

  const legAvg = CalculateLegAvg(team.teamId);
  console.log(legAvg)
  const matchAvg = CalculateMatchAvg(team.teamId);
  const wins = team.wins;

  const count_180 = CalculateMatchMileStones(team.teamId, 180);
  const count_120 = CalculateMatchMileStones(team.teamId, 120);
  const count_60 = CalculateMatchMileStones(team.teamId, 60);

  const checkOutAvg = CalculateCheckOutAvg(team.teamId);

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

        <div className="group bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
         {
          checkOutAvg && checkOutAvg?.rate > 0 &&  <div className={`absolute ${isActiveTeam ? "bg-secondary" : "bg-background"} bottom-full mb-4 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-center text-white text-sm rounded-lg shadow-lg p-4 z-50 w-max min-w-[200px]`}>
            <div className={`absolute ${isActiveTeam ? "bg-secondary" : "bg-background"} w-2 h-2 rotate-[45deg] -bottom-1`}></div>
            <div className="w-full flex justify-center items-center gap-3">
                <p><span className="font-bold">{checkOutAvg?.won}</span> out of <span className="font-bold">{checkOutAvg?.tries}</span></p>
              </div>
          </div>
         }
          <div className="text-center">
            <div className="text-sm uppercase tracking-wide text-gray-400 mb-1">Checkout</div>
            <div className="text-3xl font-bold text-white">{isNaN(Number(checkOutAvg?.rate.toFixed(2))) ? 0 : checkOutAvg?.rate.toFixed(2)}%</div>
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

