"use client";

import styles from "./RetroLayout.module.css";

export default function RetroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.container}>
      <div className={styles.banner}>
        <h1 className={styles.title}>DEFINITELY NOT TETRIS</h1>
      </div>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
