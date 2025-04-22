// src/components/SearchStrip.js
import React, { useState, useRef, useEffect } from "react";
import styles from "../styles/SearchStrip.module.css";
import { FaSearch, FaBars } from "react-icons/fa";
import { useSearch } from "../context/SearchContext";
import CategoryMenu from "./CategoryMenu";
import { useNavigate } from "react-router-dom";

const SearchStrip = ({ categories }) => {
  const { setSearchTerm } = useSearch();
  const [showMenu, setShowMenu] = useState(false);
  const [localTerm, setLocalTerm] = useState("");
  const menuRef = useRef(null); // ✅ רפרנס לתפריט
  const navigate = useNavigate();

  // ✅ סגירה אוטומטית בלחיצה מחוץ לתפריט או על Escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    const handleEsc = (e) => {
      if (e.key === "Escape") setShowMenu(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const handleInputChange = (e) => {
    setLocalTerm(e.target.value);
  };

  const handleSearch = () => {
    setSearchTerm(localTerm.trim());
    navigate("/products");
    setShowMenu(false); // ✅ סגור תפריט אחרי חיפוש
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className={styles.stripWrapper}>
      <div className={styles.menuTriggerWrapper}>
        <div className={styles.iconWrapper}>
          <button
            className={styles.hamburgerButton}
            onClick={() => setShowMenu((prev) => !prev)}
          >
            <FaBars />
          </button>

          {showMenu && Array.isArray(categories) && categories.length > 0 && (
            <div className={styles.menuWrapper} ref={menuRef}>
              <CategoryMenu
                categories={categories}
                closeMenu={() => setShowMenu(false)}
              />
            </div>
          )}
        </div>

        <span
          className={styles.categoriesLabel}
          onClick={() => setShowMenu((prev) => !prev)}
        >
          כל הקטגוריות
        </span>
      </div>

      <div className={styles.searchBox}>
        <input
          type="text"
          placeholder="אני רוצה לקנות..."
          className={styles.searchInput}
          value={localTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <FaSearch className={styles.searchIcon} onClick={handleSearch} />
      </div>
    </div>
  );
};

export default SearchStrip;
