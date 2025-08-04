import React, { FC, useMemo } from "react";
import { Team } from "../types/types";
import useMatch from "../hooks/MatchProvider";
import PlayerCard from "./PlayerCard";
import ScoreHistory from "./ScoreHistory";
import CheckOut from "./CheckOut";
import { Progress } from "antd";

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
  const { legAvg, matchAvg, remainingScore, winsNeeded, progressPercent } =
    useMemo(() => {
      const legAvg = CalculateLegAvg(teamId);
      const matchAvg = CalculateMatchAvg(teamId);
      const remainingScore = GetRemainingScore(teamId);

      const legs = match?.matchSettings.legs ?? 0;
      const winsNeeded = match?.matchSettings.mode === "First to"
        ? legs
        : Math.floor(legs / 2) + 1;

      const progressPercent = winsNeeded ? (wins / winsNeeded) * 100 : 0;

      return { legAvg, matchAvg, remainingScore, winsNeeded, progressPercent };
    }, [
      teamId,
      wins,
      match?.matchSettings,
      CalculateLegAvg,
      CalculateMatchAvg,
      GetRemainingScore,
    ]);

  // Memoizált osztálynevek
  const cardClasses = useMemo(
    () =>
      `${isActiveTeam
        ? "bg-gradient-to-br from-primary to-gray-800"
        : "bg-white/10"
      } relative flex flex-col items-center gap-4 p-5 rounded-xl min-w-80 cursor-pointer transition-all duration-300 hover:scale-[1.02]`,
    [isActiveTeam]
  );

  const glowRingClasses = useMemo(() => {
    const baseIntensity = isActiveTeam ? 20 : 3;
    return [
      `absolute w-64 h-64 rounded-full blur-2xl animate-pulse bg-gradient-to-r from-primary/${baseIntensity} to-secondary/${baseIntensity}`,
      `absolute w-56 h-56 rounded-full blur-xl animate-pulse delay-300 bg-gradient-to-r from-primary/${baseIntensity + 5
      } to-secondary/${baseIntensity + 5}`,
      `absolute w-48 h-48 rounded-full blur-lg animate-pulse delay-150 bg-gradient-to-r from-primary/${baseIntensity + 10
      } to-secondary/${baseIntensity + 10}`,
      `absolute w-44 h-44 rounded-full blur-md animate-pulse delay-500 bg-gradient-to-r from-primary/${baseIntensity + 15
      } to-secondary/${baseIntensity + 15}`,
    ];
  }, [isActiveTeam]);

  const scoreCircleClasses = useMemo(
    () =>
      `relative w-40 h-40 rounded-full bg-gradient-to-br from-gray-900 via-black to-gray-900 shadow-2xl flex items-center justify-center z-10 transition-all duration-300 ${isActiveTeam
        ? "border-4 border-primary/60 shadow-primary/30"
        : "border-4 border-primary/20"
      }`,
    [isActiveTeam]
  );

  const innerGlowClasses = useMemo(
    () =>
      `absolute inset-2 rounded-full blur-sm ${isActiveTeam
        ? "bg-gradient-to-r from-primary/25 to-secondary/25"
        : "bg-gradient-to-r from-primary/8 to-secondary/8"
      }`,
    [isActiveTeam]
  );

  // Statisztikák megjelenítése
  const renderStats = () => {
    const stats = [];
    if (wins > 0) stats.push({ label: "Wins", value: wins });
    if (!isNaN(Number(legAvg))) stats.push({ label: "Leg Avg", value: legAvg });
    if (!isNaN(Number(matchAvg)))
      stats.push({ label: "Match Avg", value: matchAvg });

    return stats.length > 0 ? (
      <div className="w-full flex justify-around">
        {stats.map(({ label, value }) => (
          <p key={label} className="bg-white/5 rounded-sm p-2 text-sm">
            {label}: {value}
          </p>
        ))}
      </div>
    ) : null;
  };

  return (
    <div onClick={() => SetCurrentTeamIndex(teamIndex)} className={cardClasses}>
      {/* Score Display */}
      <div className="relative my-10 flex items-center justify-center z-2">
        <Progress
          type="dashboard"
          steps={winsNeeded}
          percent={progressPercent}
          showInfo={false}
          trailColor="transparent"
          strokeWidth={10}
          size={210}
          className="absolute z-100"
        />

        {/* Glow rings */}
        {glowRingClasses.map((className, index) => (
          <div key={index} className={className} />
        ))}

        {/* Rotating ring for active team */}
        {isActiveTeam && (
          <div
            className="absolute w-60 h-60 rounded-full border-2 border-dashed border-primary-400/60 animate-spin"
            style={{ animationDuration: "40s" }}
          />
        )}

        {/* Main score circle */}
        <div className={scoreCircleClasses}>
          <div className={innerGlowClasses} />
          <span className="relative block text-5xl font-black bg-gradient-to-br from-white via-primary-100 to-primary-200 bg-clip-text text-transparent z-20">
            {remainingScore}
          </span>
        </div>
      </div>

      {/* CheckOut component */}
      {remainingScore !== undefined && remainingScore <= 180 && (
        <div className="w-full flex justify-center gap-2">
          <CheckOut team={team} />
        </div>
      )}

      {/* Players */}
      <div className="w-full flex justify-center gap-2">
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
      {renderStats()}

      {/* Score History */}
      <div className="w-full">
        <ScoreHistory teamIndex={teamIndex} />
      </div>
    </div>
  );
};

export default React.memo(TeamCard);
