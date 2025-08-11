import React, { FC, useEffect, useState } from "react";
import usePlayers from "../hooks/usePlayers";
import { CheckOutMode, Leg, Match, SavedMatch, Team } from "../types/types";
import {
  Button,
  Form,
  Select,
  Checkbox,
  Typography,
  Segmented,
  InputNumber,
  Card,
  Input,
} from "antd";
import useMatch from "../hooks/MatchProvider";
import { IoClose, IoAddCircle, IoPeople, IoSettings, IoPlay, IoSave, IoPersonAdd } from "react-icons/io5";
import type { CheckboxProps } from "antd";

const { Title } = Typography;

interface GameSetupProps {
  Close: () => void;
}

const GameSetup: FC<GameSetupProps> = ({ Close }) => {
  const maxLegLength = 5;
  const { players, newPlayer, setNewPlayer, AddPlayer } =
    usePlayers();
  const [teams, setTeams] = useState<Team[]>([]);
  const { match, CreateMatch } = useMatch();
  const [playerOptions, setPlayerOptions] = useState<
    { value: number | null; label: string }[]
  >([]);

  const [legs, setLegs] = useState<number>(1);
  const [mode, setMode] = useState<"First to" | "Best of">("First to");
  const [startingScore, setStartingScore] = useState<number>(501);
  const [randomStartingTeam, setRandomStartingTeam] = useState<boolean>(false);
  const [randomStartingPlayer, setRandomStartingPlayer] = useState<boolean>(false);
  const [checkOutMode, setCheckOutMode] = useState<CheckOutMode>('Simple');
  const [badgeMode, setBadgeMode] = useState<boolean>(false);

  useEffect(() => {
    const localStorageMatch = localStorage.getItem("match");
    console.log("Local Storage Match:", JSON.parse(localStorageMatch!));
    if (localStorageMatch) {
      const parsedMatch = JSON.parse(localStorageMatch);
      setTeams(parsedMatch.teams);
      setCheckOutMode(parsedMatch.matchSettings.checkOutMode);
      setStartingScore(parsedMatch.matchSettings.startingScore);
      setMode(parsedMatch.matchSettings.mode);
      setLegs(parsedMatch.matchSettings.legs);
      setRandomStartingTeam(parsedMatch.matchSettings.randomStartingTeam);
      setRandomStartingPlayer(parsedMatch.matchSettings.randomStartingPlayer);
      setBadgeMode(parsedMatch.matchSettings.badgeMode);
    }
  }, []);

  const handleCheckOutMode = (value: CheckOutMode) => {
    setCheckOutMode(value);
  };

  const handleRandomStartingTeam: CheckboxProps["onChange"] = (e) => {
    setRandomStartingTeam(e.target.checked);
  };

  const handleRandomStartingPlayer: CheckboxProps["onChange"] = (e) => {
    setRandomStartingPlayer(e.target.checked);
  };

  const handleBadgeMode: CheckboxProps["onChange"] = (e) => {
    setBadgeMode(e.target.checked);
  };

  useEffect(() => {
    const options = players.map((player) => ({
      value: player.playerId,
      label: player.name,
    }));
    setPlayerOptions(options);
  }, [players]);

  const handleLegChange = (value: number) => {
    setLegs(value);
  };

  const handleModeChange = (value: string) => {
    setMode(value as "First to" | "Best of");
  };

  const handleStartingScoreChange = (value: number | null) => {
    if (value !== null) {
      setStartingScore(value);
    }
  };

  const AddFirstTeam = () => {
    AddTeam();
    AddEmptyPlayerToTeam(0);
  };

  const AddTeam = () => {
    const newTeam: Team = {
      teamId: teams.length,
      name: `Team ${teams.length + 1}`,
      players: [],
      currentPlayerIndex: 0,
      wins: 0,
    };
    setTeams((prevTeams) => [...prevTeams, newTeam]);
  };

  const UpdatePlayerInTeam = (
    teamIndex: number,
    playerIndex: number,
    playerId: number | null
  ) => {
    const player = players.find((p) => p.playerId === playerId);
    if (!player) return;

    setTeams((prevTeams) => {
      const updatedTeams = [...prevTeams];
      const team = { ...updatedTeams[teamIndex] };
      const playersCopy = [...team.players];
      playersCopy[playerIndex] = player;
      team.players = playersCopy;
      updatedTeams[teamIndex] = team;
      return updatedTeams;
    });
  };

  const AddEmptyPlayerToTeam = (teamIndex: number) => {
    setTeams((prevTeams) => {
      const updatedTeams = [...prevTeams];
      const team = { ...updatedTeams[teamIndex] };
      team.players = [...team.players, { playerId: null, name: "" }];
      updatedTeams[teamIndex] = team;
      return updatedTeams;
    });
  };

  const RemoveTeam = (teamIndex: number) => {
    setTeams((prevTeams) => {
      const updatedTeams = [...prevTeams];
      updatedTeams.splice(teamIndex, 1);

      const renamedTeams = updatedTeams.map((team, index) => ({
        ...team,
        teamId: index,
        name: `Team ${index + 1}`,
      }));

      return renamedTeams;
    });
  };

  const RemovePlayer = (teamIndex: number, playerIndex: number) => {
    setTeams((prevTeams) => {
      const updatedTeams = [...prevTeams];
      const team = { ...updatedTeams[teamIndex] };

      const updatedPlayers = [...team.players];
      updatedPlayers.splice(playerIndex, 1);

      team.players = updatedPlayers;
      updatedTeams[teamIndex] = team;

      return updatedTeams;
    });
  };

  const handleSave = () => {
    if (teams.length === 0) {
      alert("Please add at least one Team!");
      return;
    }

    for (const team of teams) {
      if (team.players.length === 0) {
        alert("Missing Player!");
        return;
      }
      for (const player of team.players) {
        if (player.name === "") {
          alert("Select Player");
          return;
        }
      }
    }

    const resetTeams = ResetTeams();

    CreateMatch(
      resetTeams,
      legs,
      mode,
      startingScore,
      randomStartingTeam,
      randomStartingPlayer,
      checkOutMode,
      badgeMode,
    );

    Close();
  };

  const ResetTeams = (): Team[] => {
    return teams.map((team) => ({
      ...team,
      remainingScore: startingScore,
      currentPlayerIndex: randomStartingPlayer
        ? Math.floor(Math.random() * team.players.length)
        : 0,
      wins: 0,
    }));
  };

  return (
    <div className="">
      {/* Header */}
      <div className="flex flex-col gap-4 max-w-6xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <IoSettings className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Game Setup</h1>
              <p className="text-slate-400">Configure your dart match</p>
            </div>
          </div>
          <button
            onClick={Close}
            className="cursor-pointer w-10 h-10 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center text-slate-300 hover:text-white transition-all duration-200"
          >
            <IoClose className="text-xl" />
          </button>
        </div>

        {/* Game Settings Card */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <IoSettings className="text-white text-sm" />
            </div>
            <h2 className="text-xl font-semibold text-white">Match Settings</h2>
          </div>

          <div className="flex gap-6">
            {/* Game Mode */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-300">Game Mode</label>
              <Segmented
                options={["First to", "Best of"]}
                value={mode}
                onChange={(value) => handleModeChange(value)}
                size="large"
              />
            </div>

            {/* Legs */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-300">Number of Legs</label>
              <Segmented
                options={Array.from({ length: maxLegLength }, (_, i) => i + 1)}
                onChange={(value) => handleLegChange(value)}
                value={legs}
                size="large"
              />
            </div>

            {/* Checkout Mode */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-300">Checkout Mode</label>
              <Segmented
                options={["Simple", "Double", "Triple"]}
                onChange={(value) => handleCheckOutMode(value as CheckOutMode)}
                value={checkOutMode}
                size="large"
              />
            </div>

            {/* Starting Score */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-300">Starting Score</label>
              <InputNumber
                value={startingScore}
                onChange={(value) => handleStartingScoreChange(value)}
                controls={false}
                size="large"
              />
            </div>
          </div>

          {/* Random Options */}
          <div className="mt-8 pt-6 border-t border-slate-700">
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={randomStartingTeam}
                  onChange={handleRandomStartingTeam}
                  className="text-white"
                />
                <span className="text-slate-300 font-medium">Random Starting Team</span>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={randomStartingPlayer}
                  onChange={handleRandomStartingPlayer}
                  className="text-white"
                />
                <span className="text-slate-300 font-medium">Random Starting Player</span>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={badgeMode}
                  onChange={handleBadgeMode}
                  className="text-white"
                />
                <span className="text-slate-300 font-medium">Badge mode {badgeMode ? "On" : "Off"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Teams Section */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <IoPeople className="text-white text-sm" />
              </div>
              <h2 className="text-xl font-semibold text-white">Teams & Players</h2>
              <span className="bg-emerald-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                {teams.length} {teams.length === 1 ? 'Team' : 'Teams'}
              </span>
            </div>
            <button
              onClick={() => { AddTeam(); AddEmptyPlayerToTeam(teams.length) }}
              className="cursor-pointer flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-emerald-500/25"
            >
              <IoAddCircle className="text-lg" />
              Add Team
            </button>
          </div>

          {/* Teams Grid */}
          {teams.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {teams.map((team, teamIndex) => (
                <div
                  key={`team-${teamIndex}`}
                  className="bg-white/10 border border-slate-600 rounded-xl p-5 hover:border-emerald-500/50 transition-all duration-300 group"
                >
                  {/* Team Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-lg flex items-center justify-center text-white font-bold">
                        {teamIndex + 1}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{team.name}</h3>
                        <p className="text-xs text-slate-400">{team.players.length} players</p>
                      </div>
                    </div>
                    <button
                      onClick={() => RemoveTeam(teamIndex)}
                      className="cursor-pointer w-8 h-8 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white rounded-lg flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
                    >
                      <IoClose className="text-sm" />
                    </button>
                  </div>

                  {/* Players */}
                  <div className="space-y-3">
                    {team.players.map((player, playerIndex) => (
                      <div key={playerIndex} className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-xs font-medium">
                          {playerIndex + 1}
                        </div>
                        <div className="flex-1">
                          <Select
                            size="large"
                            className="w-full"
                            options={playerOptions}
                            placeholder={`Select Player ${playerIndex + 1}`}
                            value={player.playerId ?? undefined}
                            onChange={(value) => UpdatePlayerInTeam(teamIndex, playerIndex, value)}
                            showSearch
                            optionFilterProp="label"
                            filterSort={(optionA, optionB) =>
                              (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                            }
                          />
                        </div>
                        <button
                          onClick={() => RemovePlayer(teamIndex, playerIndex)}
                          className="cursor-pointer w-8 h-8 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white rounded-lg flex items-center justify-center transition-all duration-200"
                        >
                          <IoClose className="text-sm" />
                        </button>
                      </div>
                    ))}

                    {/* Add Player Button */}
                    <button
                      onClick={() => AddEmptyPlayerToTeam(teamIndex)}
                      className="cursor-pointer w-full flex items-center justify-center gap-2 bg-slate-600 hover:bg-emerald-500/20 border border-dashed border-slate-500 hover:border-emerald-500 text-slate-400 hover:text-emerald-400 py-3 rounded-lg transition-all duration-200 font-medium"
                    >
                      <IoAddCircle className="text-lg" />
                      Add Player
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <IoPeople className="text-3xl text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-300 mb-2">No teams yet</h3>
              <p className="text-slate-400 mb-6">Add your first team to get started</p>
              <button
                onClick={AddFirstTeam}
                className="cursor-pointer flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium mx-auto transition-all duration-200 shadow-lg hover:shadow-emerald-500/25"
              >
                <IoAddCircle className="text-lg" />
                Add First Team
              </button>
            </div>
          )}
        </div>

        {/* New player */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <IoPersonAdd className="text-white text-sm" />
              </div>
              <h2 className="text-xl font-semibold text-white">Add new Player</h2>
            </div>
          </div>

          <div className="flex gap-4">
            <Input
              value={newPlayer}
              placeholder="Player name"
              onChange={(e) => setNewPlayer(e.target.value)}
              size="large"
            />
            <button
              onClick={AddPlayer}
              className="cursor-pointer w-full flex items-center justify-center gap-2 bg-slate-600 hover:bg-emerald-500/20 border border-dashed border-slate-500 hover:border-emerald-500 text-slate-400 hover:text-emerald-400 py-3 rounded-lg transition-all duration-200 font-medium"
            >
              <IoAddCircle className="text-lg" />
              Add Player
            </button>
          </div>
        </div>

        {/* Load Match */}

        {/* Action Buttons */}
        {teams.length > 0 && (
          <div className="flex justify-end gap-4 mt-8">
            {/* Cancel Button - Muted emerald */}
            <button
              onClick={Close}
              className="cursor-pointer flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-slate-200 px-8 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg"
            >
              <IoClose className="text-lg" />
              Cancel
            </button>

            {/* Save Button - Medium emerald */}
            {/* <button
              onClick={Close}
              className="cursor-pointer flex items-center gap-2 bg-emerald-700/30 hover:bg-emerald-600/40 border border-emerald-600/40 hover:border-emerald-500/60 text-emerald-200 hover:text-emerald-100 px-8 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-emerald-500/15"
            >
              <IoSave className="text-lg" />
              Save current match
            </button> */}

            {/* Primary Action Button - Full emerald */}
            <button
              onClick={handleSave}
              className="cursor-pointer flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-emerald-500/25 ring-2 ring-emerald-400/30 hover:ring-emerald-400/50"
            >
              <IoPlay className="text-lg" />
              Start Game
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameSetup;