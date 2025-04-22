import React from "react";
import styles from "../styles/ShippingMethod.module.css";

const ShippingMethod = ({ selected, onSelect }) => {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>בחר/י שיטת משלוח:</h3>
      <div className={styles.buttons}>
        <button
          className={selected === "delivery" ? styles.active : ""}
          onClick={() => onSelect("delivery")}
        >
          משלוח עם שליח
        </button>
        <button
          className={selected === "pickup_point" ? styles.active : ""}
          onClick={() => onSelect("pickup_point")}
        >
          נקודות איסוף
        </button>
        <button
          className={selected === "self" ? styles.active : ""}
          onClick={() => onSelect("self")}
        >
          איסוף עצמי
        </button>
      </div>
    
    </div>
  );
};

export default ShippingMethod;
