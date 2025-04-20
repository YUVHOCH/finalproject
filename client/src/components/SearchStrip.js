// src/components/SearchStrip.js
import React, { useState } from "react";
import styles from "../styles/SearchStrip.module.css";
import { FaSearch, FaBars } from "react-icons/fa";
import { useSearch } from "../context/SearchContext";
import CategoryMenu from "./CategoryMenu";

const SearchStrip = ({ categories }) => {
  const { searchTerm, setSearchTerm } = useSearch();
  const [showMenu, setShowMenu] = useState(false);

  const handleInputChange = (e) => {
    const value = e.target.value.trimStart();
    setSearchTerm(value);
  };

  const handleSearch = () => {
    console.log("🔍 מחפש:", searchTerm);
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

          {showMenu && (
            <div className={styles.menuWrapper}>
              <CategoryMenu categories={categories} />
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
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <FaSearch className={styles.searchIcon} onClick={handleSearch} />
      </div>
    </div>
  );
};

export default SearchStrip;
