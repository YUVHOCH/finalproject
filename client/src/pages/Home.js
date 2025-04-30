// src/pages/Home.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import HeroBanner from "../components/HeroBanner";
import styles from "../styles/Home.module.css";
import { useTranslation } from "react-i18next";
import SearchStrip from "../components/SearchStrip";
import { useSearch } from "../context/SearchContext";
import axios from "axios";
import CategoryMenu from "../components/CategoryMenu";
import commonStyles from "../styles/common.module.css";


const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useParams();
  const { searchTerm, setSearchTerm } = useSearch();
  const [showMenu, setShowMenu] = useState(false);


  const [products, setProducts] = useState([]);
  const [limit, setLimit] = useState(100);
  const [loading, setLoading] = useState(true);

  const selectedPath = [params.level1, params.level2, params.level3].filter(Boolean);
  const selectedCategory = selectedPath[selectedPath.length - 1] || "";
  const categories = Array.isArray(products)
  ? products.map(p => ({
      category: p.category,
      subcategory: p.subcategory,
      subsubcategory: p.subsubcategory
    }))
  : [];
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:8000/products");
        const data = Array.isArray(res.data) ? res.data : res.data.products || [];
        console.log("דוגמה למוצר ראשון:", data[0]);  // נראה מוצר לדוגמה
        console.log("האם יש שדה isSale?", data.some(p => p.isSale !== undefined));  // נבדוק אם יש בכלל שדה כזה
        setProducts(data);
      } catch (err) {
        console.error("שגיאה בטעינת מוצרים", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!params.level1 && !params.level2 && !params.level3 && !window.location.search) {
      setSearchTerm("");
    }
  }, [params, setSearchTerm]);

  const handleLimitChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setLimit(value > 0 ? value : products.length);
  };

  const filteredProducts = products
    .filter((p) => {
      const s = searchTerm?.toLowerCase() || "";
      const matchCategory =
        selectedCategory === "" ||
        p.category?.toLowerCase() === selectedCategory.toLowerCase();
      const matchSearch =
        p.productName?.toLowerCase().includes(s) ||
        p.brand?.toLowerCase().includes(s) ||
        p.sku?.toString().includes(s);

      // בינתיים בלי פילטור של isSale
      return matchCategory && matchSearch;
    });

  console.log("Total products before limit:", filteredProducts.length);
  
  // נשים את ה-limit בנפרד
  const productsToShow = filteredProducts.slice(0, limit);
  console.log("Products after limit:", productsToShow.length);

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.stickyHeader}>
        <header className={styles.siteHeader}> {/* לוגו / ניווט */} </header>
      </div>

      <main className={styles.mainContent}>
        <SearchStrip categories={categories} />
        <HeroBanner />

        <div className={styles.limitRow}>
          <label htmlFor="limitInput" className={styles.limitLabel}>
            {t("searchBar.limitItems")}:
          </label>
          <input
            id="limitInput"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={limit}
            onChange={handleLimitChange}
            className={styles.limitInput}
          />
        </div>

        {loading ? (
          <div className={commonStyles.loadingContainer}>
            <div className={commonStyles.spinner}></div>
          </div>
        ) : (
          <div className={styles.productsGrid}>
            {productsToShow.map((prod) => (
              <ProductCard key={prod._id || prod.sku} {...prod} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
