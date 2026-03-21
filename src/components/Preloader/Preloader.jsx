import React from "react";
import { profile } from "../../data/profile";
import styles from "../Preloader/loader.module.scss";

const Preloader = () => {
  const initials = profile.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

  return (
    <div className={styles.preloader} role="status" aria-live="polite" aria-label="Loading portfolio">
      <div className={styles.ambient} aria-hidden="true"></div>
      <div className={styles.panel}>
        <div className={styles.mark} aria-hidden="true">
          <p className={styles.initials}>{initials}</p>
        </div>
        <p className={styles.eyebrow}>Loading Portfolio</p>
        <h1 className={styles.name}>{profile.name}</h1>
        <p className={styles.title}>{profile.title}</p>
        <div className={styles.progress} aria-hidden="true">
          <span className={styles.progressBar}></span>
          <span className={styles.progressGlow}></span>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
