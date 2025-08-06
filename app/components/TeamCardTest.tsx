import React, { FC, useMemo } from "react";
import { Team } from "../types/types";
import useMatch from "../hooks/MatchProvider";
import PlayerCard from "./PlayerCard";
import ScoreHistory from "./ScoreHistory";
import CheckOut from "./CheckOut";
import { FaCrown } from "react-icons/fa";
import { Progress } from "antd";
import TeamStatistics from "./TeamStatistics";
import { FaArrowLeftLong } from "react-icons/fa6";

interface TeamCardProps {
  team: Team;
  teamIndex: number;
}

const TeamCard: FC<TeamCardProps> = ({ team, teamIndex }) => {
  const {
    match,
    SetCurrentTeamIndex,
    CalculateLegAvg,
    CalculateMatchAvg,
    GetRemainingScore,
  } = useMatch();

  const { teamId, name, players, wins } = team;
  const isActiveTeam = match?.currentTeamIndex === teamId;

  // Memoizált számítások a felesleges újraszámítások elkerülésére
  const { remainingScore, winsNeeded, progressPercent } = useMemo(() => {
    const remainingScore = GetRemainingScore(teamId);

    const legs = match?.matchSettings.legs ?? 0;
    const winsNeeded =
      match?.matchSettings.mode === "First to"
        ? legs
        : Math.floor(legs / 2) + 1;

    const progressPercent = winsNeeded ? (wins / winsNeeded) * 100 : 0;

    return { remainingScore, winsNeeded, progressPercent };
  }, [
    teamId,
    wins,
    match?.matchSettings,
    CalculateLegAvg,
    CalculateMatchAvg,
    GetRemainingScore,
  ]);

  // Memoizált osztálynevek - nagyobb glow ringek
  const glowRingClasses = useMemo(() => {
    const baseIntensity = isActiveTeam ? 20 : 3;
    return [
      `absolute w-100 h-100 blur-xl rounded-full animate-pulse bg-gradient-to-r from-primary/${baseIntensity} to-secondary/${baseIntensity}`,
      `absolute w-90 h-90 blur-xl rounded-full animate-pulse delay-300 bg-gradient-to-r from-primary/${
        baseIntensity + 5
      } to-secondary/${baseIntensity + 5}`,
      `absolute w-80 h-80 rounded-full animate-pulse delay-150 bg-gradient-to-r from-primary/${
        baseIntensity + 10
      } to-secondary/${baseIntensity + 10}`,
      `absolute w-60 h-60 rounded-full animate-pulse delay-500 bg-gradient-to-r from-primary/${
        baseIntensity + 15
      } to-secondary/${baseIntensity + 15}`,
    ];
  }, [isActiveTeam]);

  return (
    <div className="flex">
      {match && teamId === 0 && match?.legs[match.currentLegIndex].legScoreHistory.length > 0 && (
        <div className="w-[400px] h-[80%] flex justify-self-start self-end bg-gray-700/50 rounded-lg py-10 pl-10 pr-20 -mr-10 text-left">
          {/* Score History */}
          <ScoreHistory teamIndex={teamIndex} />
        </div>
      )}
      <div
        onClick={() => SetCurrentTeamIndex(teamIndex)}
        className={`${
          isActiveTeam
            ? "bg-gradient-to-br from-primary to-gray-800"
            : "bg-gray-800"
        } relative flex flex-col items-center gap-6 p-8 rounded-2xl min-w-120 cursor-pointer transition-all duration-300 hover:scale-[1.02]`}
      >
        <div id="remainingScore" className="flex-1/2">
          {match?.winnerTeamIndex === teamIndex && (
            <div className="absolute -right-6 -top-6 rotate-45">
              <FaCrown size={70} />
            </div>
          )}
          <div className="relative my-12 flex items-center justify-center z-2">
            <Progress
              type="dashboard"
              steps={winsNeeded}
              percent={progressPercent}
              showInfo={false}
              trailColor="transparent"
              strokeWidth={10}
              size={280}
              className="absolute z-100"
            />

            {/* Glow rings */}
            {glowRingClasses.map((className, index) => (
              <div key={index} className={className} />
            ))}

            {/* Rotating ring for active team - nagyobb */}
            {isActiveTeam && (
              <div
                className="absolute w-74 h-74 rounded-full border-3 border-dashed border-primary-400/60 animate-spin"
                style={{ animationDuration: "40s" }}
              />
            )}

            {/* Main score circle - nagyobb */}
            <div
              className={`relative w-52 h-52 rounded-full bg-gradient-to-br from-gray-900 via-black to-gray-900 shadow-2xl flex items-center justify-center z-10 transition-all duration-300 ${
                isActiveTeam
                  ? "border-4 border-primary/60 shadow-primary/30"
                  : "border-4 border-primary/20"
              }`}
            >
              <div
                className={`absolute inset-2 rounded-full blur-sm ${
                  isActiveTeam
                    ? "bg-gradient-to-r from-primary/25 to-secondary/25"
                    : "bg-gradient-to-r from-primary/8 to-secondary/8"
                }`}
              />
              <span className="relative block text-7xl font-black bg-gradient-to-br from-white via-primary-100 to-primary-200 bg-clip-text text-transparent z-20">
                {remainingScore}
              </span>
            </div>
          </div>

          <CheckOut team={team} />
        </div>
        <div
          id="info"
          className="w-full h-full flex-1/2 flex flex-col items-center justify-end gap-4"
        >
          {/* Players */}
          <div className="w-full flex justify-center gap-3">
            {players.map((player, playerIndex) => (
              <PlayerCard
                key={`${teamId}-${playerIndex}`} // Jobb key a re-renderek elkerülésére
                player={player}
                playerIndex={playerIndex}
                teamIndex={teamIndex}
              />
            ))}
          </div>

          {/* Statistics */}
          <TeamStatistics team={team} />
        </div>
      </div>
      {match?.teams && teamId === match?.teams.length - 1 && (
        <div className="w-[400px] h-[80%] flex justify-self-end self-end bg-gray-700/50 rounded-lg py-10 pl-20 pr-10 -ml-10 text-right">
          {/* Score History */}
          <ScoreHistory teamIndex={teamIndex} />
        </div>
      )}
    </div>
  );
};

export default React.memo(TeamCard);

// <div
//   onClick={() => SetCurrentTeamIndex(teamIndex)}
//   className={`${
//     isActiveTeam
//       ? "bg-gradient-to-br from-primary to-gray-800"
//       : "bg-white/10"
//   } relative flex flex-col items-center gap-6 p-8 rounded-2xl min-w-120 cursor-pointer transition-all duration-300 hover:scale-[1.02]`}
// >
//   {/* Score Display */}
//   {match?.winnerTeamIndex === teamIndex && (
//     <div className="absolute -right-6 -top-6 rotate-45">
//       <FaCrown size={70} />
//     </div>
//   )}
//   <div className="relative my-12 flex items-center justify-center z-2">
//     <Progress
//       type="dashboard"
//       steps={winsNeeded}
//       percent={progressPercent}
//       showInfo={false}
//       trailColor="transparent"
//       strokeWidth={10}
//       size={280}
//       className="absolute z-100"
//     />

//     {/* Glow rings */}
//     {glowRingClasses.map((className, index) => (
//       <div key={index} className={className} />
//     ))}

//     {/* Rotating ring for active team - nagyobb */}
//     {isActiveTeam && (
//       <div
//         className="absolute w-74 h-74 rounded-full border-3 border-dashed border-primary-400/60 animate-spin"
//         style={{ animationDuration: "40s" }}
//       />
//     )}

//     {/* Main score circle - nagyobb */}
//     <div
//       className={`relative w-52 h-52 rounded-full bg-gradient-to-br from-gray-900 via-black to-gray-900 shadow-2xl flex items-center justify-center z-10 transition-all duration-300 ${
//         isActiveTeam
//           ? "border-4 border-primary/60 shadow-primary/30"
//           : "border-4 border-primary/20"
//       }`}
//     >
//       <div
//         className={`absolute inset-2 rounded-full blur-sm ${
//           isActiveTeam
//             ? "bg-gradient-to-r from-primary/25 to-secondary/25"
//             : "bg-gradient-to-r from-primary/8 to-secondary/8"
//         }`}
//       />
//       <span className="relative block text-7xl font-black bg-gradient-to-br from-white via-primary-100 to-primary-200 bg-clip-text text-transparent z-20">
//         {remainingScore}
//       </span>
//     </div>
//   </div>

//   <CheckOut team={team} />

//   {/* Players */}
//   <div className="w-full flex justify-center gap-3">
//     {players.map((player, playerIndex) => (
//       <PlayerCard
//         key={`${teamId}-${playerIndex}`} // Jobb key a re-renderek elkerülésére
//         player={player}
//         playerIndex={playerIndex}
//         teamIndex={teamIndex}
//       />
//     ))}
//   </div>

//   {/* Statistics */}
//   <TeamStatistics team={team} />

//   {/* Score History */}
//   <div className="w-full mt-4">
//     <ScoreHistory teamIndex={teamIndex} />
//   </div>
// </div>
