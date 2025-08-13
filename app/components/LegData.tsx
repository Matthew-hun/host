import React from "react";
import useMatch from "../hooks/MatchProvider";
import ScoreInput from "./ScoreInput";
import { FaArrowRotateLeft } from "react-icons/fa6";

const LegData = () => {
  const { match, RemoveScore } = useMatch();
  return (
    <div className="w-full flex flex-col justify-center items-center bg-white/10 backdrop-blur-md px-20 py-2 rounded-2xl border border-white/20">
      <div className="relative w-fit flex flex-col">
        <div className="absolute z-10 top-1/2 -right-8 hover:text-primary-hover">
          <FaArrowRotateLeft className="cursor-pointer" onClick={RemoveScore}/>
        </div>
        <div className="flex items-center justify-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/70">
              {match?.matchSettings.mode} {match?.matchSettings.legs}
            </span>
          </div>
          <div className="relative bg-white/10 px-2 py-1 rounded text-sm font-medium text-white">
            {typeof match?.currentLegIndex === "number"
              ? match.currentLegIndex + 1
              : "-"}{" "}
            | {match?.matchSettings.maxLeg}
          </div>
        </div>
        <div className="flex gap-1 mt-2 justify-center">
          {[...Array(match?.matchSettings.maxLeg)].map((_, i) => (
            <div
              key={i}
              className={`w-5 h-1 rounded-full transition-all ${
                i < (match?.currentLegIndex ?? -1) + 1
                  ? "bg-emerald-400"
                  : "bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>
      <div className="w-full flex justify-center">
        <ScoreInput />
      </div>
    </div>
  );
};

export default LegData;
