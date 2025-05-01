"use client";

import { useEffect, useRef } from "react";
import styles from "./NextPiece.module.css";

interface NextPieceProps {
  piece: {
    shape: number[][];
    type: string;
  } | null;
}

const PREVIEW_SIZE = 4;
const BLOCK_SIZE = 15;

export default function NextPiece({ piece }: NextPieceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (!piece) return;

    // Calculate piece dimensions
    const pieceWidth = piece.shape[0].length * BLOCK_SIZE;
    const pieceHeight = piece.shape.length * BLOCK_SIZE;

    // Calculate center position
    const centerX = (canvas.width - pieceWidth) / 2;
    const centerY = (canvas.height - pieceHeight) / 2;

    // Draw the piece centered
    ctx.fillStyle = "#00ffff";
    piece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          ctx.fillRect(
            centerX + x * BLOCK_SIZE,
            centerY + y * BLOCK_SIZE,
            BLOCK_SIZE - 1,
            BLOCK_SIZE - 1
          );
        }
      });
    });
  }, [piece]);

  return (
    <div className={styles.nextPieceContainer}>
      <h3 className={styles.nextPieceLabel}>NEXT</h3>
      <canvas
        ref={canvasRef}
        width={PREVIEW_SIZE * BLOCK_SIZE}
        height={PREVIEW_SIZE * BLOCK_SIZE}
        className={styles.nextPieceCanvas}
      />
    </div>
  );
}
