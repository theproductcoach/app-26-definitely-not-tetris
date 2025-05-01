"use client";

import Link from "next/link";
import styles from "./HomeLink.module.css";

export default function HomeLink() {
  return (
    <Link href="/" className={styles.homeLink}>
      ← HOME
    </Link>
  );
}
