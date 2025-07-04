import { useState } from "react";
import { usePlayers } from "../../Tournament/context/PlayerContext";

export default function PlayerAdjustment() {
  const { players, addPlayer, removePlayer } = usePlayers();

  const [newPlayer, setNewPlayer] = useState("");
  const [showTournamentNameInput, setShowTournamentInput] = useState(false);
  const [tournamentName, setTournamentName] = useState("");
  const [error, setError] = useState("");

  const handleAddPlayer = () => {
    const trimmedName = newPlayer.trim();
    if (trimmedName === "") {
      setError("Player name cannot be empty.");
      return;
    }
    if (players.some((p) => p.toLowerCase() === trimmedName.toLowerCase())) {
      setError(`The Player Name "${trimmedName}" already exists.`);
      return;
    }
    addPlayer(trimmedName);
    setNewPlayer("");
    setError("");
  };

  const handleRemovePlayer = (index) => {
    removePlayer(players[index]);
  };

  const handleStart = () => {
    if (players.length < 4) {
      setError("Please add at least 4 players.");
      return;
    }
    setShowTournamentInput(true);
    setError("");
  };

  const handleConfirmTournament = () => {
    if (tournamentName.trim() === "") {
      setError("Please enter a tournament name.");
      return;
    }
    localStorage.setItem("tournament-name", tournamentName.trim());
    localStorage.setItem("matches", JSON.stringify([]));
    localStorage.setItem("results", JSON.stringify([]));
    window.location.hash = "/tournament";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddPlayer();
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center px-4 relative">
      <h1 className="text-3xl font-bold mb-6">Player Adjustment</h1>

      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          value={newPlayer}
          onChange={(e) => {
            setNewPlayer(e.target.value);
            setError("");
          }}
          onKeyDown={handleKeyDown}
          placeholder="Player Name"
          className="bg-gray-700 text-white p-2 rounded-lg"
        />
        <button
          onClick={handleAddPlayer}
          className="bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Add
        </button>
      </div>

      <ul className="space-y-2 mb-6">
        {players.map((player, index) => (
          <li
            key={index}
            className="flex justify-between items-center bg-gray-800 px-4 py-2 rounded-lg w-64"
          >
            <span>{player}</span>
            <button
              onClick={() => handleRemovePlayer(index)}
              className="text-red-500 hover:text-red-700 font-bold"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      {error && <p className="text-red-400 mb-4">{error}</p>}

      <button
        onClick={handleStart}
        className="px-6 py-3 rounded-xl text-lg font-semibold transition-all bg-blue-600 hover:bg-blue-700"
      >
        Start Tournament
      </button>

      {showTournamentNameInput && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50 p-4 rounded-lg">
          <h3 className="text-2xl mb-4">Enter Tournament Name</h3>
          <input
            type="text"
            value={tournamentName}
            onChange={(e) => setTournamentName(e.target.value)}
            placeholder="Tournament Name"
            className="bg-gray-700 text-white p-2 rounded-lg mb-4 w-full max-w-xs"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleConfirmTournament();
              }
            }}
          />
          <div className="flex space-x-2">
            <button
              className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
              onClick={handleConfirmTournament}
            >
              Confirm
            </button>
            <button
              className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
              onClick={() => setShowTournamentInput(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
