import React, { FC, useEffect, useState } from "react";
import usePlayers from "../hooks/usePlayers";
import { CheckOutMode, Leg, Match, Team } from "../types/types";
import {
  Button,
  Form,
  Select,
  Checkbox,
  Typography,
  Segmented,
  InputNumber,
  Card,
} from "antd";
import useMatch from "../hooks/MatchProvider";
import { IoClose } from "react-icons/io5";
import type { CheckboxProps } from "antd";

const { Title } = Typography;

interface GameSetupProps {
  Close: () => void;
}

const GameSetup: FC<GameSetupProps> = ({Close}) => {
  const maxLegLength = 5; // Maximum number of legs
  const { players } = usePlayers();
  const [teams, setTeams] = useState<Team[]>([]);
  const { match, CreateMatch } = useMatch();
  const [playerOptions, setPlayerOptions] = useState<
    { value: number | null; label: string }[]
  >([]);

  const [legs, setLegs] = useState<number>(1);
  const [mode, setMode] = useState<"First to" | "Best of">("First to");
  const [startingScore, setStartingScore] = useState<number>(501);
  const [randomStartingTeam, setRandomStartingTeam] = useState<boolean>(false);
  const [randomStartingPlayer, setRandomStartingPlayer] =
    useState<boolean>(false);
  const [checkOutMode, setCheckOutMode] = useState<CheckOutMode>('Simple');

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
    }
  }, []);

  const handleCheckOutMode = (value : CheckOutMode) => {
    setCheckOutMode(value);
  };

  const handleRandomStartingTeam: CheckboxProps["onChange"] = (e) => {
    setRandomStartingTeam(e.target.checked);
  };

  const handleRandomStartingPlayer: CheckboxProps["onChange"] = (e) => {
    setRandomStartingPlayer(e.target.checked);
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

    console.log("Updated Team:", teams[teamIndex]);
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
      // Törlés
      const updatedTeams = [...prevTeams];
      updatedTeams.splice(teamIndex, 1);

      // Újrasorszámozás
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

      // Játékosok másolása és törlés
      const updatedPlayers = [...team.players];
      updatedPlayers.splice(playerIndex, 1);

      team.players = updatedPlayers;
      updatedTeams[teamIndex] = team;

      console.log(teams);

      return updatedTeams;
    });
  };

  // const handleSave = () => {
  //   console.log(teams);

  //   if (teams.length == 0) {
  //     alert("Please add atleast one Team!");
  //     return;
  //   } else {
  //     teams.forEach((team) => {
  //       if (team.players.length == 0) {
  //         alert("Missing Player!");
  //         return;
  //       } else {
  //         team.players.forEach((player) => {
  //           if (player.name == "") {
  //             alert("Select Player");
  //             return;
  //           } else {
  //             const newMatch: Match = {
  //               teams: ResetTeams(),
  //               legs: AddNewLeg(),
  //               currentTeamIndex: randomStartingTeam
  //                 ? Math.floor(Math.random() * ResetTeams().length)
  //                 : 0,
  //               currentLegIndex: 0,
  //               matchSettings: {
  //                 mode: mode,
  //                 startingScore: startingScore,
  //                 maxLeg: legs,
  //                 doubleOut: doubleOut,
  //                 randomStartingTeam: randomStartingTeam,
  //                 randomStartingPlayer: randomStartingPlayer,
  //               },
  //               isOver: false,
  //               thrownDartsToCheckOut: null,
  //             };
  //             CreateMatch(newMatch);
  //           }
  //         });
  //       }
  //     });
  //   }
  // };

  const handleSave = () => {
    // Validáció
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

    // Csapatok resetelése az új meccshez
    const resetTeams = ResetTeams();

    CreateMatch(
      resetTeams, // A resetelt csapatokat adjuk át
      legs,
      mode,
      startingScore,
      randomStartingTeam,
      randomStartingPlayer,
      checkOutMode
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
    <div className="w-full max-h-[80vh] overflow-auto custom-scrollbar p-6">
      <Form layout="vertical">
        {/* Játék beállítások szekció */}
        <div className="mb-6 p-4 rounded-xl bg-background-light border border-gray-700">
          <div className="flex justify-center gap-4">
            <div>
              <label className="block text-white text-sm mb-2">Játék mód</label>
              <Segmented
                options={["First to", "Best of"]}
                value={mode}
                onChange={(value) => handleModeChange(value)}
                defaultValue="First to"
              />
            </div>

            <div>
              <label className="block text-white text-sm mb-2">
                Leg-ek száma
              </label>
              <Segmented
                options={Array.from({ length: maxLegLength }, (_, i) => i + 1)}
                onChange={(value) => handleLegChange(value)}
                defaultValue={1}
                value={legs}
              />
            </div>

            <div>
              <label className="block text-white text-sm mb-2">
                Checkout mode
              </label>
              <Segmented
                options={["Simple", "Double", "Triple"]}
                onChange={(value) => handleCheckOutMode(value as CheckOutMode)}
                defaultValue="Simple"
                value={checkOutMode}
              />
            </div>

            <div>
              <label className="block text-white text-sm mb-2">
                Kezdő pontszám
              </label>
              <InputNumber
                defaultValue={501}
                onChange={(value) => handleStartingScoreChange(value)}
                controls={false}
                value={startingScore}
              />
            </div>
          </div>

          {/* Opciók */}
          <div className="mt-4 flex justify-center gap-4">
            <Checkbox
              className="text-white"
              checked={randomStartingTeam}
              onChange={handleRandomStartingTeam}
            >
              Random Team
            </Checkbox>

            <Checkbox
              className="text-white"
              checked={randomStartingPlayer}
              onChange={handleRandomStartingPlayer}
            >
              Random Player
            </Checkbox>
          </div>
        </div>

        {/* Csapatok szekció */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-white text-lg font-semibold">Csapatok</h2>
            <Button type="primary" onClick={() => {AddTeam(); AddEmptyPlayerToTeam(teams.length)}}>
              + New Team
            </Button>
          </div>

          <div className="flex flex-col gap-4">
            {teams.map((team, teamIndex) => (
              <div
                key={`team-${teamIndex}`}
                className="rounded-xl bg-background-light border border-gray-700 p-4 shadow-lg"
              >
                {/* Csapat fejléc */}
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-white text-lg font-semibold">
                    {team.name || `Csapat ${teamIndex + 1}`}
                  </h3>
                  <IoClose
                    onClick={() => RemoveTeam(teamIndex)}
                    className="text-2xl text-white/50 hover:text-red-500 cursor-pointer transition-colors"
                  />
                </div>

                {/* Játékosok listája */}
                <div className="space-y-3">
                  {team.players.map((player, playerIndex) => (
                    <div key={playerIndex} className="flex items-center gap-3">
                      <div className="flex-1">
                        <Select
                          className="w-full"
                          options={playerOptions}
                          placeholder={`Játékos kiválasztása (${
                            playerIndex + 1
                          })`}
                          value={player.playerId ?? undefined}
                          onChange={(value) =>
                            UpdatePlayerInTeam(teamIndex, playerIndex, value)
                          }
                        />
                      </div>
                      <IoClose
                        onClick={() => RemovePlayer(teamIndex, playerIndex)}
                        className="text-xl text-white/50 hover:text-red-500 cursor-pointer transition-colors flex-shrink-0"
                      />
                    </div>
                  ))}
                </div>

                {/* Új játékos hozzáadása gomb */}
                <div className="mt-4 pt-3 border-t border-gray-600">
                  <Button
                    type="default"
                    className="w-full border border-dashed border-primary text-color-primary hover:text-white hover:bg-primary-hover transition-all font-medium"
                    onClick={() => AddEmptyPlayerToTeam(teamIndex)}
                  >
                    + Add Player
                  </Button>
                </div>
              </div>
            ))}

            {/* Üres állapot, ha nincsenek csapatok */}
            {teams.length === 0 && (
              <div className="text-center py-8 text-white/60">
                <p className="mb-4">Még nincsenek csapatok hozzáadva</p>
                <Button type="primary" onClick={AddFirstTeam}>
                  Add First team
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Akció gombok */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
          <Button type="primary" size="large" onClick={handleSave}>
            Start
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default GameSetup;
