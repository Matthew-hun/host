import React, { FC, useState, useEffect } from "react";
import { Player, Throw } from "../types/types";
import useMatch from "../hooks/MatchProvider";
import { GiTrophyCup } from "react-icons/gi";
import Badge, { BadgeProps } from "./Badge";

interface PlayerCardProps {
  player: Player;
  playerIndex: number;
  teamIndex: number;
  isActiveTeam: boolean;
}

type PlayerStats = {
  label: string;
  value: string | number;
}

const PlayerCard: FC<PlayerCardProps> = ({
  player,
  playerIndex,
  teamIndex,
  isActiveTeam
}) => {
  const {
    match,
    SetCurrentPlayerIndex,
    BiggestLegScorePlayer,
    BiggestMatchScorePlayer,
    GetPlayerScores,
    CalculatePlayerLegAvg,
    CalculatePlayerMatchAvg,
    CalculateCheckOutAvg,
  } = useMatch();
  const { name, playerId } = player;
  const [badges, setBadges] = useState<BadgeProps[]>([]);
  const [playerScores, setPlayerScores] = useState<Throw[]>();
  const [playerStats, setPlayerStats] = useState<PlayerStats[]>([]);

  const silver = BiggestLegScorePlayer();
  const golden = BiggestMatchScorePlayer();
  const isActive = match?.teams[teamIndex].currentPlayerIndex === playerIndex;

  useEffect(() => {
    const newBadges: BadgeProps[] = [];
    const playerStats: PlayerStats[] = [];
    if (playerId == golden?.playerId?.playerId && teamIndex == golden?.teamId) {
      newBadges.push({
        icon: GiTrophyCup,
        label: "Top Match",
        desc: "Biggest match score",
        type: "legendary",
      });
    }

    const playerScores = GetPlayerScores(teamIndex, playerId);
    setPlayerScores(playerScores);
    playerScores?.forEach((score) => {
      if (score.score >= 180) {
        newBadges.push({
          icon: GiTrophyCup,
          label: "180",
          desc: "Scored 180 in a leg",
          type: "epic",
        });
      }

      if (score.score == 69) {
        newBadges.push({
          icon: GiTrophyCup,
          label: "Lucky 69",
          desc: "Scored 69 in a leg",
          type: "rare",
        });
      }
    });

    if (playerScores && playerScores?.length > 0) {
      const bestScore = Math.max(...playerScores?.flatMap((score) => { return score.score }));
      playerStats.push({ label: "Best score:", value: bestScore });
    }

    if (player && player.playerId !== null) {
      const legAvg = CalculatePlayerLegAvg(teamIndex, player.playerId);
      const matchAvg = CalculatePlayerMatchAvg(teamIndex, player.playerId);
      const checkOutAvg = CalculateCheckOutAvg(teamIndex, player.playerId!)?.rate.toFixed(2);

      legAvg && playerStats.push({ label: "Leg Avg:", value: legAvg });
      matchAvg && playerStats.push({ label: "Match Avg:", value: matchAvg });
      checkOutAvg && !isNaN(Number(checkOutAvg)) && playerStats.push({ label: "CheckOut Avg:", value: checkOutAvg + "%" });
    }

    setPlayerStats(playerStats);
    setBadges(newBadges);
  }, [match, playerIndex, golden, teamIndex]);

  return (
    <div className="relative">
      {
        match?.matchSettings.badgeMode ? badges.map((badge, index) => {
          return (
            <Badge
              key={index}
              icon={badge.icon}
              label={badge.label}
              desc={badge.desc}
              type={badge.type}
            />
          );
        }) : (<div className="absolute z-10 right-0 -top-2">
          {playerId == golden?.playerId?.playerId && teamIndex == golden?.teamId && <GiTrophyCup color="#FFD700" size={25} />}
          {silver?.playerId.playerId !== golden?.playerId.playerId && playerId == silver?.playerId.playerId && teamIndex == silver?.teamId && <GiTrophyCup color="#C0C0C0" size={23} />}
        </div>)
      }
      <div className="relative group inline-block">
        {/* Tooltip tartalma */}
        {
          playerStats.length > 0 && <div className={`absolute ${isActiveTeam ? "bg-secondary" : "bg-background"} bottom-full mb-4 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-center text-white text-sm rounded-lg shadow-lg p-4 z-50 w-max min-w-[200px]`}>
            <div className={`absolute ${isActiveTeam ? "bg-secondary" : "bg-background"} w-2 h-2 rotate-[45deg] -bottom-1`}></div>
            {playerStats?.map((stat, index) => {
              return (<div key={index} className="w-full flex justify-between items-center gap-3">
                <p>{stat.label}</p>
                <p className="font-bold">{stat.value}</p>
              </div>)
            })}
          </div>
        }

        {/* Trigger elem */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            SetCurrentPlayerIndex(teamIndex, playerIndex);
          }}
          className={`px-8 py-3 rounded-md cursor-pointer transition-all duration-300 text-sm font-medium ${isActive
            ? "bg-emerald-500/15 text-emerald-300 shadow-xl"
            : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
        >
          <p className="text-xl">{name}</p>
        </div>
      </div>

    </div>
  );
};

export default PlayerCard;