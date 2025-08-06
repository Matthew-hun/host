import React, { FC, use, useEffect } from "react";
import { Player } from "../types/types";
import useMatch from "../hooks/MatchProvider";
import { GiTrophyCup } from "react-icons/gi";
import Badge, { BadgeProps } from "./Badge";

interface PlayerCardProps {
  player: Player;
  playerIndex: number;
  teamIndex: number;
}

const PlayerCard: FC<PlayerCardProps> = ({
  player,
  playerIndex,
  teamIndex,
}) => {
  const {
    match,
    SetCurrentPlayerIndex,
    BiggestLegScorePlayer,
    BiggestMatchScorePlayer,
    GetPlayerScores,
  } = useMatch();
  const { name, playerId } = player;
  const [badges, setBadges] = React.useState<BadgeProps[]>([]);

  const silver = BiggestLegScorePlayer();
  const golden = BiggestMatchScorePlayer();
  const isActive = match?.teams[teamIndex].currentPlayerIndex === playerIndex;

  useEffect(() => {
    const newBadges: BadgeProps[] = [];
    if (playerId == golden?.playerId?.playerId && teamIndex == golden?.teamId) {
      newBadges.push({
        icon: GiTrophyCup,
        label: "Top Match",
        desc: "Biggest match score",
        type: "legendary",
      });
    }

    const playerScores = GetPlayerScores(teamIndex, playerId);
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

    setBadges(newBadges);
  }, [match, playerIndex, golden, teamIndex]);

  return (
    <div className="relative">
      <div className="absolute z-10 right-0 -top-2">
        {playerId == golden?.playerId?.playerId && teamIndex == golden?.teamId && <GiTrophyCup color="#FFD700" size={25}/>}
        {silver?.playerId !== golden?.playerId && playerId == silver?.playerId.playerId && teamIndex == silver?.teamId && <GiTrophyCup color="#C0C0C0" size={23}/>}
      </div>
      {/* {badges.map((badge, index) => {
        return (
          <Badge
            key={index}
            icon={badge.icon}
            label={badge.label}
            desc={badge.desc}
            type={badge.type}
          />
        );
      })} */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          SetCurrentPlayerIndex(teamIndex, playerIndex);
        }}
        className={`relative px-8 py-3 rounded-md cursor-pointer transition-all duration-300 text-sm font-medium ${
          isActive
            ? "bg-emerald-500/15 text-emerald-300 shadow-xl"
            : "bg-white/5 text-white/60 hover:bg-white/10"
        }`}
      >
        <p className="text-xl">{name}</p>
      </div>
    </div>
  );
};

export default PlayerCard;
