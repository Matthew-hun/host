import React, { FC } from "react";
import { Player } from "../types/types";
import useMatch from "../hooks/MatchProvider";
import { GiTrophyCup } from "react-icons/gi";

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
  const { match, SetCurrentPlayerIndex, BiggestLegScorePlayer, BiggestMatchScorePlayer } = useMatch();
  const { name, playerId } = player;

  const silver = BiggestLegScorePlayer();
  const golden = BiggestMatchScorePlayer();
  const isActive = match?.teams[teamIndex].currentPlayerIndex === playerIndex;

  return (
    <div className="relative">
      <div className="absolute z-10 right-0 -top-2">
        {playerId == golden?.playerId.playerId && teamIndex == golden?.teamId && <GiTrophyCup color="#FFD700" size={25}/>}
        {silver?.playerId !== golden?.playerId && playerId == silver?.playerId.playerId && teamIndex == silver?.teamId && <GiTrophyCup color="#C0C0C0" size={23}/>}
      </div>
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
