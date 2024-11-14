import React, { useEffect, useRef, useState } from "react";
import "./Game.css";

import io from "socket.io-client";

const socket = io("http://localhost:4000"); // Backend url

const WIN_PATTERNS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const Game = () => {
  const [grid, setGrid] = useState(new Array(9).fill(""));
  const [isXTurn, setIsXTurn] = useState(true);
  const [winner, setWinner] = useState(null);
  const [roomId, setRoomId] = useState("123"); // Can be dynamic

  const currentPlayer = isXTurn ? "X" : "O";
  const gridRef = useRef(grid);

  useEffect(() => {
    gridRef.current = grid;
  }, [grid]);

  const resetGame = () => {
    setGrid(new Array(9).fill(""));
    setIsXTurn(true);
    setWinner(null);
  };

  const handleGameReset = () => {
    console.log("game reset emitting");
    socket.emit("reset", roomId);
  };

  const winPatternMatch = (pattern, user, grid) => {
    return pattern.every((item) => grid[item] === user);
  };

  const handleCellClick = (cellIndex) => {
    if (winner !== null || grid[cellIndex] !== "") return;

    socket.emit("makeMove", roomId, {
      index: cellIndex,
      player: currentPlayer,
    });
  };

  const checkPlayerWin = (cellIndex, grid, player) => {
    for (const pattern of WIN_PATTERNS) {
      if (
        pattern.includes(cellIndex) &&
        winPatternMatch(pattern, player, grid)
      ) {
        return true;
      }
    }

    return false;
  };

  const checkGameOver = (cellIndex, player) => {
    const updatedGrid = [...gridRef.current];
    updatedGrid[cellIndex] = player;
    const playerWon = checkPlayerWin(cellIndex, updatedGrid, player);

    if (playerWon) {
      setWinner(player);
    } else if (updatedGrid.every((element) => element !== "")) {
      setWinner("Draw");
    }
  };

  useEffect(() => {
    socket.emit("joinGame", roomId);

    // Listen for moves from other players
    socket.on("moveMade", (move) => {
      const { index: cellIndex, player } = move;

      setGrid((prev) =>
        prev.map((cell, index) => (index === cellIndex ? player : cell))
      );
      setIsXTurn(player === "X" ? false : true);
      checkGameOver(cellIndex, player);
    });

    // game reset
    socket.on("reset", resetGame);
  }, [roomId, socket]);

  return (
    <div className="game-container">
      <div className="grid-container">
        {grid.map((cell, index) => {
          return (
            <div
              key={index}
              className="grid-cell"
              onClick={() => handleCellClick(index)}
            >
              {cell}
            </div>
          );
        })}
      </div>
      <div className="player-turn">{currentPlayer}s turn</div>
      {winner && (
        <div className="game-over">
          <div>
            {winner === "Draw" ? (
              <div>{`Game over: Nobody wins`}</div>
            ) : (
              <div>{`Game over: ${winner} won`}</div>
            )}
            <button className="replay-btn" onClick={handleGameReset}>
              Replay
            </button>
          </div>
        </div>
      )}
      <button className="clear-btn" onClick={handleGameReset}>
        Clear board
      </button>
    </div>
  );
};

export default Game;
