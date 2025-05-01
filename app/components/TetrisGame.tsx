"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./TetrisGame.module.css";
import GameControls from "./GameControls";
import {
  TETROMINO_ASSETS,
  BLOCK_ASSETS,
  BACKGROUNDS,
} from "../utils/tetrominoAssets";
import NextPiece from "./NextPiece";

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const BLOCK_SIZE = 30;

type Position = {
  x: number;
  y: number;
};

type Tetromino = {
  shape: number[][];
  position: Position;
  type: string;
  rotation: number;
};

const TETROMINOES = {
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
  },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
  },
};

type GameState = {
  board: number[][];
  currentPiece: Tetromino | null;
  nextPiece: Tetromino | null;
  score: number;
  level: number;
  lines: number;
  gameOver: boolean;
  isPlaying: boolean;
};

const createEmptyBoard = () =>
  Array(BOARD_HEIGHT)
    .fill(null)
    .map(() => Array(BOARD_WIDTH).fill(0));

const getRandomTetromino = (mode: "classic" | "zetris"): Tetromino => {
  const types = Object.keys(TETROMINOES);
  const type =
    mode === "zetris" ? "Z" : types[Math.floor(Math.random() * types.length)];
  const tetromino = TETROMINOES[type as keyof typeof TETROMINOES];

  return {
    shape: tetromino.shape,
    position: {
      x:
        Math.floor(BOARD_WIDTH / 2) - Math.floor(tetromino.shape[0].length / 2),
      y: -2, // Start slightly above the board
    },
    type,
    rotation: 0,
  };
};

export default function TetrisGame({ mode }: { mode: "classic" | "zetris" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>({
    board: createEmptyBoard(),
    currentPiece: null,
    nextPiece: null,
    score: 0,
    level: 1,
    lines: 0,
    gameOver: false,
    isPlaying: false,
  });

  const checkCollision = (
    piece: Tetromino,
    board: number[][],
    offsetX = 0,
    offsetY = 0
  ): boolean => {
    return piece.shape.some((row, y) =>
      row.some((value, x) => {
        if (!value) return false;
        const newX = piece.position.x + x + offsetX;
        const newY = piece.position.y + y + offsetY;
        return (
          newX < 0 ||
          newX >= BOARD_WIDTH ||
          newY >= BOARD_HEIGHT ||
          (newY >= 0 && board[newY][newX] !== 0)
        );
      })
    );
  };

  const moveDown = () => {
    setGameState((prev) => {
      if (!prev.currentPiece || prev.gameOver || !prev.isPlaying) return prev;

      if (!checkCollision(prev.currentPiece, prev.board, 0, 1)) {
        return {
          ...prev,
          currentPiece: {
            ...prev.currentPiece,
            position: {
              ...prev.currentPiece.position,
              y: prev.currentPiece.position.y + 1,
            },
          },
        };
      }

      // If collision, merge piece and spawn new one
      const newBoard = [...prev.board.map((row) => [...row])];

      // Check if current piece is at or above the top
      const isAtTop = prev.currentPiece.position.y <= 0;

      // Merge current piece into board
      prev.currentPiece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value) {
            const boardY = prev.currentPiece!.position.y + y;
            const boardX = prev.currentPiece!.position.x + x;
            if (boardY >= 0 && boardY < BOARD_HEIGHT) {
              newBoard[boardY][boardX] = 1;
            }
          }
        });
      });

      // If piece is at top when merging, game over
      if (isAtTop) {
        return {
          ...prev,
          board: newBoard,
          gameOver: true,
          isPlaying: false,
          currentPiece: null,
          nextPiece: null,
        };
      }

      // Check for completed lines
      let linesCleared = 0;
      for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
        if (newBoard[y].every((cell) => cell === 1)) {
          newBoard.splice(y, 1);
          newBoard.unshift(Array(BOARD_WIDTH).fill(0));
          linesCleared++;
          y++;
        }
      }

      // Get new next piece
      const newNextPiece = getRandomTetromino(mode);

      // Check if next piece would collide immediately
      if (checkCollision(prev.nextPiece!, newBoard)) {
        return {
          ...prev,
          board: newBoard,
          gameOver: true,
          isPlaying: false,
          currentPiece: null,
          nextPiece: null,
        };
      }

      return {
        ...prev,
        board: newBoard,
        currentPiece: prev.nextPiece,
        nextPiece: newNextPiece,
        score: prev.score + linesCleared * 100 * prev.level,
        lines: prev.lines + linesCleared,
        level: Math.floor((prev.lines + linesCleared) / 10) + 1,
      };
    });
  };

  const movePiece = (direction: "left" | "right") => {
    setGameState((prev) => {
      if (!prev.currentPiece || prev.gameOver || !prev.isPlaying) return prev;

      const offset = direction === "left" ? -1 : 1;
      if (!checkCollision(prev.currentPiece, prev.board, offset, 0)) {
        return {
          ...prev,
          currentPiece: {
            ...prev.currentPiece,
            position: {
              ...prev.currentPiece.position,
              x: prev.currentPiece.position.x + offset,
            },
          },
        };
      }
      return prev;
    });
  };

  const rotatePiece = () => {
    setGameState((prev) => {
      if (!prev.currentPiece || prev.gameOver || !prev.isPlaying) return prev;

      const rotated = {
        ...prev.currentPiece,
        shape: prev.currentPiece.shape[0].map((_, i) =>
          prev.currentPiece!.shape.map((row) => row[i]).reverse()
        ),
        rotation: (prev.currentPiece.rotation + 1) % 4,
      };

      // Wall kick attempts
      const kicks = [0, -1, 1, -2, 2];
      for (const kick of kicks) {
        rotated.position.x += kick;
        if (!checkCollision(rotated, prev.board)) {
          return { ...prev, currentPiece: rotated };
        }
        rotated.position.x -= kick;
      }

      return prev;
    });
  };

  const startGame = () => {
    const firstPiece = getRandomTetromino(mode);
    const secondPiece = getRandomTetromino(mode);
    setGameState({
      board: createEmptyBoard(),
      currentPiece: firstPiece,
      nextPiece: secondPiece,
      score: 0,
      level: 1,
      lines: 0,
      gameOver: false,
      isPlaying: true,
    });
  };

  // Game loop
  useEffect(() => {
    if (gameState.isPlaying && !gameState.gameOver) {
      const speed = Math.max(100, 1000 - (gameState.level - 1) * 100);
      const gameLoop = setInterval(moveDown, speed);
      return () => clearInterval(gameLoop);
    }
  }, [gameState.isPlaying, gameState.gameOver, gameState.level]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameState.isPlaying || gameState.gameOver) return;

      // Prevent default behavior for game control keys
      if (
        ["ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp", " "].includes(e.key)
      ) {
        e.preventDefault();
      }

      switch (e.key) {
        case "ArrowLeft":
          movePiece("left");
          break;
        case "ArrowRight":
          movePiece("right");
          break;
        case "ArrowDown":
          moveDown();
          break;
        case "ArrowUp":
          rotatePiece();
          break;
        case " ": // Space - Hard drop
          while (
            gameState.currentPiece &&
            !checkCollision(gameState.currentPiece, gameState.board, 0, 1)
          ) {
            moveDown();
          }
          moveDown(); // Lock the piece
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gameState]);

  // Render game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = "#333";
    for (let i = 0; i <= BOARD_WIDTH; i++) {
      ctx.beginPath();
      ctx.moveTo(i * BLOCK_SIZE, 0);
      ctx.lineTo(i * BLOCK_SIZE, BOARD_HEIGHT * BLOCK_SIZE);
      ctx.stroke();
    }
    for (let i = 0; i <= BOARD_HEIGHT; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * BLOCK_SIZE);
      ctx.lineTo(BOARD_WIDTH * BLOCK_SIZE, i * BLOCK_SIZE);
      ctx.stroke();
    }

    // Draw board
    gameState.board.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          ctx.fillStyle = "#00f0f0";
          ctx.fillRect(
            x * BLOCK_SIZE,
            y * BLOCK_SIZE,
            BLOCK_SIZE - 1,
            BLOCK_SIZE - 1
          );
        }
      });
    });

    // Draw current piece
    if (gameState.currentPiece) {
      ctx.fillStyle = "#f0f000";
      gameState.currentPiece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value) {
            const drawX = (gameState.currentPiece!.position.x + x) * BLOCK_SIZE;
            const drawY = (gameState.currentPiece!.position.y + y) * BLOCK_SIZE;
            if (drawY >= 0) {
              // Only draw if visible on board
              ctx.fillRect(drawX, drawY, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
            }
          }
        });
      });
    }
  }, [gameState]);

  return (
    <div className={styles.gameContainer}>
      <div className={styles.gameInfo}>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>SCORE</span>
          <span className={styles.infoValue}>{gameState.score}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>LEVEL</span>
          <span className={styles.infoValue}>{gameState.level}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>LINES</span>
          <span className={styles.infoValue}>{gameState.lines}</span>
        </div>
      </div>

      <div className={styles.gameWrapper}>
        <canvas
          ref={canvasRef}
          width={BOARD_WIDTH * BLOCK_SIZE}
          height={BOARD_HEIGHT * BLOCK_SIZE}
          className={styles.gameCanvas}
        />
        {!gameState.isPlaying && !gameState.gameOver && (
          <button className={styles.startButton} onClick={startGame}>
            Start Game
          </button>
        )}
        {gameState.gameOver && (
          <div className={styles.gameOver}>
            <h2>Game Over</h2>
            <p>Final Score: {gameState.score}</p>
            <button className={styles.restartButton} onClick={startGame}>
              Restart
            </button>
          </div>
        )}
        <div className={styles.sidePanel}>
          <NextPiece piece={gameState.nextPiece} />
          <GameControls
            onMove={(direction) => {
              if (direction === "down") {
                moveDown();
              } else {
                movePiece(direction);
              }
            }}
            onRotate={rotatePiece}
          />
        </div>
      </div>
    </div>
  );
}
