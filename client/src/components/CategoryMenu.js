// ✅ src/components/CategoryMenu.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/CategoryMenu.module.css";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../context/SearchContext";

const CategoryMenu = ({ categories, closeMenu }) => {
  const { setSearchTerm } = useSearch();
  const navigate = useNavigate();
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [categoryCounts, setCategoryCounts] = useState({}); // 🆕 ספירת מוצרים לפי תת־תת־קטגוריה

  // מארגן את הקטגוריות בצורה נקייה ומסננת כפילויות
  const organizedCategories = React.useMemo(() => {
    const mainCats = [...new Set(categories.filter(c => c.category).map(c => c.category))];
    const categoryMap = {};

    mainCats.forEach(mainCat => {
      // מוצא את כל תתי הקטגוריות הייחודיות למיין קטגורי
      const subsForMain = [...new Set(
        categories
          .filter(c => c.category === mainCat && c.subcategory)
          .map(c => c.subcategory)
      )];

      categoryMap[mainCat] = {
        subCategories: {}
      };

      subsForMain.forEach(sub => {
        // מסנן כפילויות בתת-תת קטגוריות
        const uniqueSubsubs = [...new Set(
          categories
            .filter(c => 
              c.category === mainCat && 
              c.subcategory === sub && 
              c.subsubcategory
            )
            .map(c => c.subsubcategory)
        )];

        if (uniqueSubsubs.length > 0) {
          categoryMap[mainCat].subCategories[sub] = uniqueSubsubs;
        }
      });
    });

    return categoryMap;
  }, [categories]);

  // בחירת קטגוריה ראשונה כברירת מחדל
  useEffect(() => {
    const firstCategory = Object.keys(organizedCategories)[0];
    if (firstCategory && !hoveredCategory) {
      setHoveredCategory(firstCategory);
    }
  }, [organizedCategories, hoveredCategory]);

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

  const handleItemClick = (main, sub, subsub) => {
    setSearchTerm("");
    navigate(`/products/${encodeURIComponent(main)}/${encodeURIComponent(sub)}/${encodeURIComponent(subsub)}`);
    closeMenu();
  };

  // חישוב מספר העמודות הנדרש לפי מספר תתי הקטגוריות
  const getColumnCount = (subCategories) => {
    const count = Object.keys(subCategories).length;
    return Math.min(Math.max(2, Math.ceil(count / 2)), 4); // מינימום 2 עמודות, מקסימום 4
  };

  return (
    <div className={styles.menuContainer}>
      {/* רשימת קטגוריות ראשיות */}
      <div className={styles.mainCategories}>
        {Object.keys(organizedCategories).map(mainCat => (
          <div
            key={mainCat}
            className={`${styles.mainCategory} ${hoveredCategory === mainCat ? styles.active : ''}`}
            onMouseEnter={() => setHoveredCategory(mainCat)}
          >
            {mainCat}
          </div>
        ))}
      </div>

      {/* תת קטגוריות */}
      {hoveredCategory && (
        <div className={styles.subCategoriesWrapper}>
          <div className={styles.subCategoriesContainer}>
            {Object.entries(organizedCategories[hoveredCategory].subCategories).map(([subCat, subsubCats]) => (
              <div key={subCat} className={styles.subCategoryGroup}>
                <div className={styles.subCategoryTitle}>{subCat}</div>
                <div className={styles.subsubCategories}>
                  {subsubCats.map(subsub => (
                    <div
                      key={subsub}
                      className={styles.subsubCategory}
                      onClick={() => handleItemClick(hoveredCategory, subCat, subsub)}
                    >
                      {subsub}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryMenu;
