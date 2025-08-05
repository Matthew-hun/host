import React, { FC } from "react";
import { Team } from "../types/types";
import useMatch from "../hooks/MatchProvider";

interface CheckOutProps {
  team: Team;
}

const CheckOut: FC<CheckOutProps> = ({ team }) => {
  const { teamId } = team;
  const { match, GetRemainingScore, GetCheckOuts2 } = useMatch();

  const possibleCheckOut = GetCheckOuts2(GetRemainingScore(teamId));

  return (
    // <div className="w-full flex justify-center items-center gap-2">
    //   {[...possibleCheckOut].slice(0, 2).map((checkOut, i) => {
    //     return (
    //       <li key={i} className="flex items-center justify-center gap-2 bg-gray-800/10 rounded-md p-2">
    //         {checkOut.map((dart) => {
    //           return <span className="text-3xl">{dart.label}</span>;
    //         })}
    //       </li>
    //     );s
    //   })}
    // </div>
    <div className="w-full flex-1/2 rounded-md gap-2">
      <ul className="w-full flex flex-col justify-center items-center gap-2 p-4">
        {[...possibleCheckOut].slice(0, 2).map((checkOut, i) => {
        return (
          <li key={i} className={`${match?.currentTeamIndex == teamId ? "bg-gray-800/10" : "bg-gray-500/10"} w-full flex items-center justify-center gap-2 rounded-md p-2`}>
            {checkOut.map((dart) => {
              return <span className="text-3xl text-center">{dart.label}</span>;
            })}
          </li>
        );
      })}
      </ul>
    </div>
  );
};

export default CheckOut;
