"use client";

import { useEffect, useState } from "react";
import styles from "./GameControls.module.css";

interface GameControlsProps {
  onMove: (direction: "left" | "right" | "down") => void;
  onRotate: () => void;
}

export default function GameControls({ onMove, onRotate }: GameControlsProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!isMobile) {
    return (
      <div className={styles.instructions}>
        <h2>Controls</h2>
        <ul>
          <li>← Left Arrow: Move Left</li>
          <li>→ Right Arrow: Move Right</li>
          <li>↓ Down Arrow: Move Down</li>
          <li>↑ Up Arrow: Rotate</li>
          <li>Space: Drop</li>
        </ul>
      </div>
    );
  }

  return (
    <div className={styles.mobileControls}>
      <div className={styles.buttonRow}>
        <button
          className={styles.controlButton}
          onClick={() => onMove("left")}
          aria-label="Move Left"
        >
          ←
        </button>
        <button
          className={styles.controlButton}
          onClick={() => onMove("down")}
          aria-label="Move Down"
        >
          ↓
        </button>
        <button
          className={styles.controlButton}
          onClick={() => onMove("right")}
          aria-label="Move Right"
        >
          →
        </button>
        <button
          className={`${styles.controlButton} ${styles.rotateButton}`}
          onClick={onRotate}
          aria-label="Rotate"
        >
          ↻
        </button>
      </div>
    </div>
  );
}
