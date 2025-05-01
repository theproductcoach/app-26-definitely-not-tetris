"use client";

import styles from "./RetroLayout.module.css";
import HomeLink from "./HomeLink";

export default function RetroLayout({
  children,
  mode,
}: {
  children: React.ReactNode;
  mode: "classic" | "zetris";
}) {
  return (
    <div className={styles.container}>
      <div className={styles.banner}>
        <div className={styles.bannerContent}>
          <HomeLink />
          <h1 className={styles.title}>{mode.toUpperCase()}</h1>
        </div>
      </div>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
