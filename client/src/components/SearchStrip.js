// src/components/SearchStrip.js
import React, { useState, useRef, useEffect } from "react";
import styles from "../styles/SearchStrip.module.css";
import { FaSearch, FaBars } from "react-icons/fa";
import { useSearch } from "../context/SearchContext";
import { useMenu } from "../context/MenuContext";
import CategoryMenu from "./CategoryMenu";
import { useNavigate } from "react-router-dom";

const SearchStrip = ({ categories }) => {
  const { setSearchTerm } = useSearch();
  const { isMenuOpen, toggleMenu } = useMenu();
  const [localTerm, setLocalTerm] = useState("");
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        toggleMenu();
      }
    };

    const handleEsc = (e) => {
      if (e.key === "Escape") toggleMenu();
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isMenuOpen, toggleMenu]);

  const handleInputChange = (e) => {
    setLocalTerm(e.target.value);
  };

  const handleSearch = () => {
    setSearchTerm(localTerm.trim());
    navigate("/products");
    if (isMenuOpen) toggleMenu();
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
            onClick={toggleMenu}
          >
            <FaBars />
          </button>

          {isMenuOpen && Array.isArray(categories) && categories.length > 0 && (
            <div className={styles.menuWrapper} ref={menuRef}>
              <CategoryMenu
                categories={categories}
                closeMenu={toggleMenu}
              />
            </div>
          )}
        </div>

        <span
          className={styles.categoriesLabel}
          onClick={toggleMenu}
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
