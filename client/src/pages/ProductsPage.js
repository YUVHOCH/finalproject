import React, { useEffect, useState } from "react";
import styles from "../styles/ProductsPage.module.css";
import commonStyles from "../styles/common.module.css";
import SearchStrip from "../components/SearchStrip";
import ProductCard from "../components/ProductCard";
import axios from "axios";
import { useSearch } from "../context/SearchContext";
import { Link, useParams } from "react-router-dom";

const ProductsPage = () => {
  const { searchTerm } = useSearch();
  const { category, subcategory, subsubcategory } = useParams();
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:8000/products");
        const data = Array.isArray(res.data) ? res.data : res.data.products || [];
        setAllProducts(data);
      } catch (err) {
        console.error("שגיאה בטעינת מוצרים", err);
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = allProducts;
  
    if (searchTerm?.trim()) {
      const lower = searchTerm.toLowerCase();
      filtered = allProducts.filter(
        (p) =>
          p.productName?.toLowerCase().includes(lower) ||
          p.brand?.toLowerCase().includes(lower) ||
          p.sku?.toString().includes(lower)
      );
    } else {
      if (category) filtered = filtered.filter(p => p.category === category);
      if (subcategory) filtered = filtered.filter(p => p.subcategory === subcategory);
      if (subsubcategory) filtered = filtered.filter(p => p.subsubcategory === subsubcategory);
    }
  
    setFilteredProducts(filtered);
  }, [allProducts, category, subcategory, subsubcategory, searchTerm]);

  const getNextLevelCategories = () => {
    if (!filteredProducts.length) return [];

    if (subcategory && !subsubcategory) {
      const items = filteredProducts.filter(p => p.category === category && p.subcategory === subcategory);
      return [...new Set(items.map(p => p.subsubcategory))];
    }

    if (category && !subcategory) {
      const items = filteredProducts.filter(p => p.category === category);
      return [...new Set(items.map(p => p.subcategory))];
    }

    return [];
  };

  return (
    <main className={styles.pageWrapper}>
      <SearchStrip
        categories={allProducts.map(p => ({
          category: p.category,
          subcategory: p.subcategory,
          subsubcategory: p.subsubcategory
        }))}
      />
  
      <div className={styles.contentWrapper}>
        <aside className={styles.sidebarFilters}>
          <div className={styles.filterGroup}>
            <h4>מותג</h4>
            <label className={styles.checkboxItem}>
              <input type="checkbox" /> Gardena
            </label>
            <label className={styles.checkboxItem}>
              <input type="checkbox" /> Ikra
            </label>
            <label className={styles.checkboxItem}>
              <input type="checkbox" /> Husqvarna
            </label>
            <label className={styles.checkboxItem}>
              <input type="checkbox" /> Solo
            </label>
            <label className={styles.checkboxItem}>
              <input type="checkbox" /> Claber
            </label>
            <label className={styles.checkboxItem}>
              <input type="checkbox" /> Hunter
            </label>
            <label className={styles.checkboxItem}>
              <input type="checkbox" /> Water-On
            </label>
          </div>

          <div className={styles.filterGroup}>
            <h4>טווח מחירים</h4>
            <label className={styles.checkboxItem}>
              <input type="checkbox" /> עד 100 ₪
            </label>
            <label className={styles.checkboxItem}>
              <input type="checkbox" /> 100–250 ₪
            </label>
            <label className={styles.checkboxItem}>
              <input type="checkbox" /> 251–500 ₪
            </label>
            <label className={styles.checkboxItem}>
              <input type="checkbox" /> מעל 500 ₪
            </label>
          </div>
        </aside>

        <div className={styles.productsSection}>
          <div className={styles.breadcrumb}>
            <span className={styles.breadcrumbItem}>
              <Link to="/">🏠</Link>
            </span>
            {searchTerm?.trim() ? (
              <>
                <span className={styles.breadcrumbSeparator}>›</span>
                <span className={styles.breadcrumbItem}>תוצאות חיפוש</span>
                <span className={styles.breadcrumbSeparator}>›</span>
                <span className={styles.breadcrumbCurrent}>{searchTerm}</span>
              </>
            ) : (
              <>
                {category && (
                  <>
                    <span className={styles.breadcrumbSeparator}>›</span>
                    <span className={styles.breadcrumbItem}>{category}</span>
                  </>
                )}
                {subcategory && (
                  <>
                    <span className={styles.breadcrumbSeparator}>›</span>
                    <span className={styles.breadcrumbItem}>{subcategory}</span>
                  </>
                )}
                {subsubcategory && (
                  <>
                    <span className={styles.breadcrumbSeparator}>›</span>
                    <span className={styles.breadcrumbCurrent}>{subsubcategory}</span>
                  </>
                )}
              </>
            )}
          </div>
 
          <h2 className={styles.pageTitle}>
            תוצאות עבור:{" "}
            {searchTerm?.trim()
              ? `"${searchTerm}"`
              : subsubcategory || subcategory || category || "כל המוצרים"}
          </h2>
  
          {loading ? (
            <div className={commonStyles.loadingContainer}>
              <div className={commonStyles.spinner}></div>
            </div>
          ) : (
            <>
              {(!subsubcategory && (subcategory || category)) && (
                <div className={styles.categoryIconsWrapper}>
                  {getNextLevelCategories().map((name, i) => (
                    <div key={i} className={styles.categoryIconBox}>
                      <img
                        src={`/categories/${name}.jpg`}
                        alt={name}
                        className={styles.categoryIconImage}
                      />
                      <span>{name}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className={styles.productsGrid}>
                {filteredProducts.map(prod => (
                  <ProductCard 
                    key={prod.sku} 
                    {...prod}
                    className={styles.categoryProductCard}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default ProductsPage;
