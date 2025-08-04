import React, { FC } from "react";
import { Team } from "../types/types";
import useMatch from "../hooks/MatchProvider";

interface CheckOutProps {
  team: Team;
}

const CheckOut: FC<CheckOutProps> = ({ team }) => {
  const { teamId, name, players, currentPlayerIndex, wins } = team;
  const { GetRemainingScore, GetCheckOuts } = useMatch();

  const possibleCheckOut = GetCheckOuts(GetRemainingScore(teamId));

  return (
    <div>
      <ul>
        {possibleCheckOut
          .slice(Math.max(possibleCheckOut.length - 2, 0))
          .map((checkOut) => {
            return <li>{checkOut.join(" ")}</li>;
          })}
      </ul>
    </div>
  );
};

export default CheckOut;
