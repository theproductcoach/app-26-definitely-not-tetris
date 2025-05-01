"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./HomePage.module.css";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Image
          src="/homepage.png"
          alt="Definitely Not Tetris"
          width={600}
          height={600}
          className={styles.logo}
          priority
        />

        <div className={styles.buttonContainer}>
          <button
            className={styles.retroButton}
            onClick={() => router.push("/classic")}
          >
            START CLASSIC MODE
          </button>
          <button
            className={styles.retroButton}
            onClick={() => router.push("/zetris")}
          >
            START ZETRIS MODE
          </button>
        </div>
      </div>
    </div>
  );
}
