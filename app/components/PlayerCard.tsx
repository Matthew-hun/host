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
  const { match, SetCurrentPlayerIndex, BiggestScorePlayer } = useMatch();
  const { name, playerId } = player;

  const a = BiggestScorePlayer();
  const isActive = match?.teams[teamIndex].currentPlayerIndex === playerIndex;

  return (
    <div className="relative">
      <div className="absolute z-10 right-0 -top-2">
        {playerId == a?.playerId.playerId && teamIndex == a?.teamId && <GiTrophyCup />}
      </div>
      <div
        onClick={(e) => {
          e.stopPropagation();
          SetCurrentPlayerIndex(teamIndex, playerIndex);
        }}
        className={`relative px-4 py-2 rounded-full cursor-pointer transition-all duration-300 text-sm font-medium ${
          isActive
            ? "bg-emerald-500/15 text-emerald-300 shadow-xl"
            : "bg-white/5 text-white/60 hover:bg-white/10"
        }`}
      >
        <p>{name}</p>
      </div>
    </div>
  );
};

export default PlayerCard;
