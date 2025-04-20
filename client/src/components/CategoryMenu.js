// ✅ src/components/CategoryMenu.js
import React, { useState } from "react";
import styles from "../styles/CategoryMenu.module.css";

const CategoryMenu = ({ categories }) => {
  const [selectedMain, setSelectedMain] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);

  // מחזיר תתי־קטגוריות ייחודיים לפי הקטגוריה הראשית
  const getSubcategories = () => {
    return Array.from(new Set(
      categories
        .filter(c => c.category === selectedMain)
        .map(c => c.subcategory)
    ));
  };

  // מחזיר תתי־תתי־קטגוריות לפי תת־קטגוריה
  const getSubSubcategories = () => {
    return Array.from(new Set(
      categories
        .filter(c => c.category === selectedMain && c.subcategory === selectedSub && c.subsubcategory)
        .map(c => c.subsubcategory)
    ));
  };

  return (
    <div className={styles.menuWrapper}>
      {/* קטגוריות ראשיות */}
      <div className={styles.column}>
        {Array.from(new Set(categories.map(c => c.category))).map((cat) => (
          <div
            key={cat}
            className={`${styles.item} ${selectedMain === cat ? styles.selected : ""}`}
            onMouseEnter={() => {
              setSelectedMain(cat);
              setSelectedSub(null);
            }}
          >
            {cat}
          </div>
        ))}
      </div>

      {/* תתי־קטגוריות */}
      {selectedMain && (
        <div className={styles.column}>
          {getSubcategories().map((sub) => (
            <div
              key={sub}
              className={`${styles.item} ${selectedSub === sub ? styles.selected : ""}`}
              onMouseEnter={() => setSelectedSub(sub)}
            >
              {sub}
            </div>
          ))}
        </div>
      )}

      {/* תתי־תתי־קטגוריות */}
{selectedSub && (
  <div className={styles.column}>
    {getSubSubcategories().map((subsub, i) => (
      <div key={i} className={styles.item}>
        {subsub}
      </div>
    ))}
  </div>
)}
    </div>
  );
};

export default CategoryMenu;
