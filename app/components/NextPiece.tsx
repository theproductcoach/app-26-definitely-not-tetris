"use client";

import { useEffect, useRef } from "react";
import styles from "./NextPiece.module.css";

interface NextPieceProps {
  piece: {
    shape: number[][];
    type: string;
  } | null;
}

const PREVIEW_SIZE = 4; // Size of the preview area
const BLOCK_SIZE = 20; // Size of each block in the preview

export default function NextPiece({ piece }: NextPieceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !piece) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Center the piece in the preview
    const offsetX = Math.floor((PREVIEW_SIZE - piece.shape[0].length) / 2);
    const offsetY = Math.floor((PREVIEW_SIZE - piece.shape.length) / 2);

    // Draw the piece
    ctx.fillStyle = "#00ffff";
    piece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          ctx.fillRect(
            (x + offsetX) * BLOCK_SIZE,
            (y + offsetY) * BLOCK_SIZE,
            BLOCK_SIZE - 1,
            BLOCK_SIZE - 1
          );
        }
      });
    });
  }, [piece]);

  if (!piece) return null;

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
