import React, { FC, useEffect, useState } from "react";
import { ScoreHistory as ScoreHistoryType, Throw } from "../types/types";
import { Divider, Segmented } from "antd";
import useMatch from "../hooks/MatchProvider";

interface ScoreHistoryProps {
  teamIndex: number;
}

type Score = Throw & {
  id: number;
};

const ScoreHistory: FC<ScoreHistoryProps> = ({ teamIndex }) => {
  const { match, GetScoreHistory } = useMatch();
  const [history, setHistory] = useState<Score[]>([]);
  const [historyType, setHistoryType] = useState<ScoreHistoryType>("Leg");

  useEffect(() => {
    let scores = GetScoreHistory(teamIndex, historyType);
    if (scores !== undefined) {
      const newScores = scores.map((score, id) => {
        return {
          ...score,
          id: id,
        };
      });

      setHistory(newScores.reverse());
    }
  }, [match, teamIndex, historyType]);

  const handleHistoryTypeChange = (value: ScoreHistoryType) => {
    setHistoryType(value);
  };

  return (
    <div className={`${history.length === 0 ? "hidden" : "w-full"}`}>
      <div className="w-full flex flex-col gap-2 bg-gray-800/30 rounded-md p-2 overflow-auto no-scrollbar">
        {/* <div className="w-full flex">
        <Segmented
          options={["Leg", "Match"]}
          value={historyType}
          onChange={(value) =>
            handleHistoryTypeChange(value as ScoreHistoryType)
          }
          onClick={(e) => e.stopPropagation()}
          block
          size="small"
          defaultValue="First to"
          className="w-full flex"
        />
      </div>
      <div>
        Thrown darts: {history.length * 3}
      </div> */}
        {history.slice(0, 5).map((score, idx) => (
          <li
            key={idx}
            className="flex items-center justify-around gap-3 rounded-md"
          >
            <span className="text-gray-300 text-md w-full flex justify-center">
              {score.id + 1}.
            </span>
            <span
              className={`font-bold ${
                score.score === 180 ? "text-rose-600" : "text-emerald-400"
              } text-md w-full flex justify-center`}
            >
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
    </div>
  );
};

export default ScoreHistory;
