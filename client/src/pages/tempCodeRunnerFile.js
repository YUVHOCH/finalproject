import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import styles from "../styles/App.module.css";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:8000/products");
        if (!res.ok) throw new Error("Server error");
        const data = await res.json();
        console.log("✅ Loaded from API");
        setProducts(data);
      } catch (err) {
        console.warn("⚠️ API failed, loading from local JSON...");
        const res = await fetch("/data/products.json");
        const data = await res.json();
        setProducts(data);
      }
    };

    fetchProducts();
  }, []);

  const handleLimitChange = (event) => {
    const value = parseInt(event.target.value, 10);
    setLimit(value > 0 ? value : 0);
  };

  return (
    <>
      <h2 style={{ margin: "20px 40px" }}>All Products</h2>

      <div className={styles.limitContainer}>
        <div className={styles.limitLine}>
          <label style={{ fontSize: "18px", color: "gray" }}>
            Number of products to show:&nbsp;
          </label>
          <input
            type="number"
            value={limit}
            onChange={handleLimitChange}
            min="1"
            max={products.length}
            className={styles.limitInput}
          />
        </div>
      </div>

      <div className={styles.productsGrid}>
        {products.slice(0, limit).map((prod) => (
          <ProductCard key={prod.sku} {...prod} />
        ))}
      </div>
    </>
  );
};

export default ProductsPage;
