// src/pages/Home.js
import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import Sidebar from "../components/Sidebar";
import SearchBarWithCategory from "../components/SearchBarWithCategory"; // שורת החיפוש
import styles from "../styles/Home.module.css"; // עיצוב לעמוד Home
import appStyles from "../styles/App.module.css"; // מחלקות כלליות
import { useTranslation } from "react-i18next";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [limit, setLimit] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const { t } = useTranslation();

  // קריאה לשרת JSON
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:8000/products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Error loading products", err);
      }
    };

    fetchProducts();
  }, []);

  // שינוי הגבלת תצוגה
  const handleLimitChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setLimit(value > 0 ? value : products.length);
  };

  const filteredProducts = products
  .filter((p) => {
    const categoryMatch =
      selectedCategory === "" ||
      p.category?.toLowerCase() === selectedCategory.toLowerCase();

    const search = searchTerm.toLowerCase();
    const name = p.productName?.toLowerCase() || "";
    const category = p.category?.toLowerCase() || "";
    const brand = p.brand?.toLowerCase() || "";

    const searchMatch =
      search === "" ||
      name.includes(search) ||
      category.includes(search) ||
      brand.includes(search);

    return categoryMatch && searchMatch;
  })
  .slice(0, limit);

  return (
    <main className={styles.main}>
  <Sidebar className={appStyles.sidebar} onSelectCategory={(cat) => setSelectedCategory(cat || "")}/>

  <div className={styles.content}>
    {/* שורת השליטה – controlRow */}
    <div className={styles.controlRow}>
      <div className={styles.limitWrapper}>
      <input
        id="limitInput"
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={limit}
        onChange={handleLimitChange}
        className={styles.limitInput}
      />

        <label htmlFor="limitInput">{t("searchBar.limitItems")}:</label>
      </div>

      <div className={styles.searchBar}>
        <SearchBarWithCategory
          onSearch={(term) => setSearchTerm(term?.toLowerCase() || "")}
          onCategoryChange={(cat) => setSelectedCategory(cat || "")}
        />
      </div>
    </div>

    {/* כרטיסי מוצרים – כולל חיפוש + limit */}
      <div className={styles.productsGrid}>
        {filteredProducts.map((prod) => (
          <ProductCard key={prod._id || prod.sku} {...prod} />
        ))}
      </div>
  </div>
</main>
  );
};

export default Home;
