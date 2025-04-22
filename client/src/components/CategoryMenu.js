// ✅ src/components/CategoryMenu.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/CategoryMenu.module.css";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../context/SearchContext";

const CategoryMenu = ({ categories, closeMenu }) => {
  const { setSearchTerm } = useSearch();
  const [selectedMain, setSelectedMain] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);
  const [categoryCounts, setCategoryCounts] = useState({}); // 🆕 ספירת מוצרים לפי תת־תת־קטגוריה
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:8000/products/category-counts")
      .then(res => {
        const counts = {};
        res.data.forEach(item => {
          counts[item._id] = item.count;
        });
        setCategoryCounts(counts);
      })
      .catch(err => console.error("שגיאה בספירת קטגוריות:", err));
  }, []);

  if (!Array.isArray(categories) || categories.length === 0) {
    return null; // ✅ מונע הצגה אם הנתונים לא תקינים
  }

  const getSubcategories = () => {
    return Array.from(new Set(
      categories
        .filter(c => c.category === selectedMain)
        .map(c => c.subcategory)
    ));
  };

  const getSubSubcategories = () => {
    return Array.from(new Set(
      categories
      .filter(c => c.category === selectedMain && c.subcategory === selectedSub)
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
        <div
          key={i}
          className={styles.item}
          onClick={() => {
            const newPath = `/products/${encodeURIComponent(selectedMain)}/${encodeURIComponent(selectedSub)}/${encodeURIComponent(subsub)}`;
            setSearchTerm("");
            if (window.location.pathname !== newPath) {
              navigate(newPath);
            } else {
              navigate("/", { replace: true });
              setTimeout(() => {
                navigate(newPath);
              }, 0);
            }
            closeMenu();
          }}
        >
          {subsub}
          <span style={{ color: "#888", fontSize: "0.9em", marginRight: "6px" }}>
            ({categoryCounts[subsub] || 0})
          </span>
        </div>
      ))}

        </div>
      )}
    </div>
  );
};

export default CategoryMenu;
