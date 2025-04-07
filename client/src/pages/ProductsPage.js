// src/pages/ProductsPage.js
import React, { useEffect, useState } from "react";
import styles from "../styles/ProductsPage.module.css";
import ProductCard from "../components/ProductCard";
import SearchBarWithCategory from "../components/SearchBarWithCategory";
import { useTranslation } from "react-i18next"; // ✅ הוסף את זה


const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [limit, setLimit] = useState(100);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { t } = useTranslation(); // ✅ קריאה לפונקציית התרגום

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:8000/products");
        const data = await res.json();
        setProducts(data);
        setLimit(data.length);
      } catch (err) {
        console.error("Error loading products", err);
      }
    };

    fetchProducts();
  }, []);

  const handleLimitChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setLimit(value > 0 ? value : products.length);
  };

  const filteredProducts = products.filter((p) => {
    const categoryMatch =
      selectedCategory === "" ||
      p.category?.toLowerCase() === selectedCategory.toLowerCase();

    const search = searchTerm.toLowerCase();
    const inName = p.productName?.toLowerCase().includes(search);
    const inCategory = p.category?.toLowerCase().includes(search);
    const inBrand = p.brand?.toLowerCase().includes(search);

    const searchMatch =
      search === "" || inName || inCategory || inBrand;

    return categoryMatch && searchMatch;
  })
  .slice(0, limit);


  return (
    <div className={styles.controlRow}>
  <div className={styles.limitWrapper}>
  <label htmlFor="limitInput">{t("searchBar.limitItems")}:</label>
    <input
      id="limitInput"
      type="number"
      min="0"
      value={limit}
      onChange={handleLimitChange}
      className={styles.limitInput}/>
</div>
<div className={styles.searchBar}>
 <SearchBarWithCategory
    onSearch={(term) => setSearchTerm(term?.toLowerCase() || "")}
    onCategoryChange={(cat) => setSelectedCategory(cat || "")}
  />
  </div>
    
      <div className={styles.productsGrid}>
        {filteredProducts.map((product) => (
          <ProductCard key={product._id || product.sku} {...product} />
        ))}
      </div>
  </div>
  );
};

export default ProductsPage;
