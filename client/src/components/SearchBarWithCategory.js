// components/SearchBarWithCategory.js
import React, { useState } from "react";
import styles from "../styles/SearchBarWithCategory.module.css";

const categories = [
  "All",
  "Lawnmowers",
  "Chainsaws",
  "Irrigation",
  "Garden Tools",
  "Pest Control"
];

const SearchBarWithCategory = ({ onSearch, onCategoryChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearch = () => {
    onSearch(searchTerm);
    onCategoryChange(selectedCategory === "All" ? "" : selectedCategory);
  };

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    setShowDropdown(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.dropdownWrapper}>
        <button
          className={styles.dropdownButton}
          onClick={() => setShowDropdown((prev) => !prev)}
        >
          {selectedCategory} ▾
        </button>
        {showDropdown && (
          <ul className={styles.dropdownMenu}>
            {categories.map((cat) => (
              <li
                key={cat}
                className={styles.dropdownItem}
                onClick={() => handleSelectCategory(cat)}
              >
                {cat}
              </li>
            ))}
          </ul>
        )}
      </div>

      <input
        type="text"
        className={styles.searchInput}
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />
      <button className={styles.searchButton} onClick={handleSearch}>
        🔍
      </button>
    </div>
  );
};

export default SearchBarWithCategory;
