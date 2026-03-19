import React from "react";
import styles from "../Preloader/loader.module.scss"

const Preloader = () => {
  return (
    <div className="preloader">
      <div className={styles.container}>
        <div className={styles.loader}>
          <span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </span>
          <div className={styles.base}>
            <span></span>
            <div className={styles.face}></div>
          </div>
        </div>
        <div className={styles.progress}></div>
      </div>
      <div>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
};

export default Preloader;
