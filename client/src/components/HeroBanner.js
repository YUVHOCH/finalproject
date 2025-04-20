//client\src\components\HeroBanner.js
import React from "react";
import styles from "../styles/HeroBanner.module.css";
import bannerImage from "../assets/banner.jpg"; // החלף לשם הקובץ שלך

const HeroBanner = () => {
  return (
    <div className={styles.hero}>
      <img src={bannerImage} alt="באנר מבצע" className={styles.image} />
    </div>
  );
};

export default HeroBanner;
