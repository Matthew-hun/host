import React, { FC, useEffect, useState } from "react";
import { Throw } from "../types/types";
import { Divider } from "antd";
import useMatch from "../hooks/MatchProvider";

interface ScoreHistoryProps {
  teamIndex: number;
}

const ScoreHistory: FC<ScoreHistoryProps> = ({ teamIndex }) => {
  const { match, GetScoreHistory } = useMatch();
  const [history, setHistory] = useState<Throw[]>([]);

  useEffect(() => {
    let scores = GetScoreHistory(teamIndex);
    if (scores !== undefined) {
      scores = scores.reverse(); // Reverse the order to show the latest scores at the top
      setHistory(scores);
    }

  }, [match, teamIndex]);

  return (
    <div className="w-full flex flex-col gap-2 max-h-[20vh] overflow-auto no-scrollbar">
      {history.map((score, idx) => (
        <li
          key={idx}
          className="flex items-center justify-around gap-3 bg-gray-800/50 rounded-md p-2"
        >
          <span className="font-bold text-emerald-400 text-md w-full flex justify-center">
            +{score.score}
          </span>
          <Divider type="vertical" className="bg-gray-500 h-3" />
          <span className="text-white font-medium text-md w-full flex justify-center">
            {score.remainingScore}
          </span>
          <Divider type="vertical" className="bg-gray-500 h-3" />
          <span className="text-gray-300 text-md w-full flex justify-center">
            {score.playerId?.name ?? ""}
          </span>
        </li>
      ))}
    </div>
  );
};

export default ScoreHistory;
