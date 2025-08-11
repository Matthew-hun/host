import React, { FC, useEffect, useMemo, useState } from "react";
import { Dart, Team } from "../types/types";
import useMatch from "../hooks/MatchProvider";
import PlayerCard from "./PlayerCard";
import ScoreHistory from "./ScoreHistory";
import CheckOut from "./CheckOut";
import { FaCrown } from "react-icons/fa";
import { Drawer, Progress } from "antd";
import TeamStatistics from "./TeamStatistics";
import { TbTargetArrow } from "react-icons/tb";

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
    GetCheckOuts2
  } = useMatch();

  const { teamId, name, players, wins } = team;
  const isActiveTeam = match?.currentTeamIndex === teamId;
  const [checkOutsDrawerOpen, setCheckOutsDrawerOpen] = useState<boolean>(false);
  const [checkOuts, setCheckOuts] = useState<Set<Dart[]>>();

  const handleCancelCheckOutsDrawer = () => {
    setCheckOutsDrawerOpen(false);
  }

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

  useEffect(() => {
    const checkOuts = GetCheckOuts2(GetRemainingScore(teamId));
    setCheckOuts(checkOuts);
    console.log(Array.from(checkOuts));
  }, [match]);

  // Memoizált osztálynevek - nagyobb glow ringek
  const glowRingClasses = useMemo(() => {
    const baseIntensity = isActiveTeam ? 20 : 3;
    return [
      `absolute w-100 h-100 blur-xl rounded-full animate-pulse bg-gradient-to-r from-primary/${baseIntensity} to-secondary/${baseIntensity}`,
      `absolute w-90 h-90 blur-xl rounded-full animate-pulse delay-300 bg-gradient-to-r from-primary/${baseIntensity + 5
      } to-secondary/${baseIntensity + 5}`,
      `absolute w-80 h-80 rounded-full animate-pulse delay-150 bg-gradient-to-r from-primary/${baseIntensity + 10
      } to-secondary/${baseIntensity + 10}`,
      `absolute w-60 h-60 rounded-full animate-pulse delay-500 bg-gradient-to-r from-primary/${baseIntensity + 15
      } to-secondary/${baseIntensity + 15}`,
    ];
  }, [isActiveTeam]);

  return (
      <div
        onClick={() => SetCurrentTeamIndex(teamIndex)}
        className={`${isActiveTeam
          ? "bg-gradient-to-br from-primary to-gray-800"
          : "bg-slate-900"
          } relative flex flex-col items-center gap-6 p-8 rounded-2xl min-w-130 cursor-pointer transition-all duration-300 hover:scale-[1.02]`}
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
              strokeWidth={8}
              size={265}
              className="absolute z-100"
            />

            {/* Glow rings */}
            {glowRingClasses.map((className, index) => (
              <div key={index} className={className} />
            ))}

            {/* Rotating ring for active team - nagyobb */}
            {isActiveTeam && (
              <div
                className="absolute w-72 h-72 rounded-full border-3 border-dashed border-primary-400/60 animate-spin"
                style={{ animationDuration: "40s" }}
              />
            )}

            {/* Main score circle - nagyobb */}
            <div
              className={`relative w-52 h-52 rounded-full bg-gradient-to-br from-gray-900 via-black to-gray-900 shadow-2xl flex items-center justify-center z-10 transition-all duration-300 ${isActiveTeam
                ? "border-4 border-primary/60 shadow-primary/30"
                : "border-4 border-primary/20"
                }`}
            >
              <div
                className={`absolute inset-2 rounded-full blur-sm ${isActiveTeam
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
                isActiveTeam={isActiveTeam}
              />
            ))}
          </div>

          {/* Statistics */}
          <TeamStatistics team={team} />

          <ScoreHistory teamIndex={teamIndex} />
        </div>
      </div>
  );
};

export default React.memo(TeamCard);

    // <div className="w-full h-full relative">
    //   {remainingScore <= 170 && <div className="absolute top-2 right-2 p-2 hover:bg-white/10 rounded-md cursor-pointer z-20" onClick={(e) => { e.stopPropagation(); setCheckOutsDrawerOpen(true); }}><TbTargetArrow size={20} /></div>}
    //   <Drawer
    //     title="Possible Checkouts"
    //     closable={{ "aria-label": "Close Button" }}
    //     onClose={handleCancelCheckOutsDrawer}
    //     open={checkOutsDrawerOpen}
    //     size="large"
    //     width="30%"
    //     placement={match?.teams && teamIndex >= Math.ceil(match.teams.length / 2) ? "right" : "left"}
    //   >
    //     <div className="flex flex-col gap-3">
    //       {checkOuts && Array.from(checkOuts).flatMap((darts, dartsIndex) => {
    //         return (
    //           <div
    //             key={dartsIndex}
    //             className="flex gap-3 items-center p-4 bg-gradient-to-r from-slate-800/60 to-slate-700/60 
    //              rounded-xl border border-slate-600/40 backdrop-blur-sm
    //              hover:border-teal-400/60 hover:bg-gradient-to-r hover:from-teal-900/20 hover:to-emerald-900/20
    //              transition-all duration-300 group shadow-lg hover:shadow-teal-500/10"
    //           >
    //             {darts.map((dart, index) => {
    //               // Detect dart type from label
    //               const label = dart.label;
    //               const isDouble = label.startsWith('D');
    //               const isTriple = label.startsWith('T');
    //               const isBull = label === 'Bull' || label === 'BULL';

    //               return (
    //                 <div
    //                   key={index}
    //                   className={`
    //           px-3 py-2 rounded-lg font-bold text-sm min-w-[50px] text-center
    //           transition-all duration-200 group-hover:scale-105 group-hover:rotate-1
    //           ${isBull
    //                       ? 'bg-gradient-to-br from-yellow-500 to-amber-600 text-white shadow-lg shadow-yellow-500/30 ring-2 ring-yellow-400/20'
    //                       : isTriple
    //                         ? 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30 ring-2 ring-red-400/20'
    //                         : isDouble
    //                           ? 'bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-400/20'
    //                           : 'bg-gradient-to-br from-slate-600 to-slate-700 text-slate-100 shadow-lg shadow-slate-500/30 ring-2 ring-slate-400/20'
    //                     }
    //           hover:shadow-xl transform-gpu
    //         `}
    //                 >
    //                   {label}
    //                 </div>
    //               )
    //             })}

    //             {/* Checkout indicator with animation */}
    //             <div className="ml-auto">
    //               <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse opacity-60 group-hover:opacity-100 transition-opacity"></div>
    //             </div>
    //           </div>
    //         )
    //       }
    //       )}

    //     </div>
    //   </Drawer>
    //   ...
    // </div>