import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useMatch from '../hooks/MatchProvider';
import { Card, Statistic } from 'antd';

const MatchStats = () => {
  const { match, GetPlayerScores } = useMatch();

  if (!match) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {match.teams.map((team, teamIndex) =>
        team.players.map((player, playerIndex) => {
          const scores = GetPlayerScores(teamIndex, player.playerId);

          return (
            <div
              key={`${teamIndex}-${playerIndex}`}
              className="bg-white/5 border border-white/10 rounded-2xl p-4 shadow-lg backdrop-blur-md"
            >
              <h3 className="text-white text-lg font-semibold mb-3">
                {player.name} – {team.name}
              </h3>

              <Table className="text-white text-sm">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-emerald-400">Score</TableHead>
                    <TableHead className="text-emerald-400">Remaining</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scores?.map((score, scoreIndex) => (
                    <TableRow key={scoreIndex}>
                      <TableCell>{score.score}</TableCell>
                      <TableCell>{score.remainingScore}</TableCell>
                    </TableRow>
                  ))}
                  {scores?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center italic text-gray-400">
                        Nincs adat
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          );
        })
      )}
      <Statistic
        title="Active"
        value={11.28}
        precision={2}
      />
    </div>
  );
};

export default MatchStats;
