import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "../styles/ProductPage.module.css";
import reviewImage from "../assets/reviews.jpg";
import addToCartImage from "../assets/addtocart.jpg";
import SearchStrip from "../components/SearchStrip";
import axios from "axios";

const ProductPage = () => {
  const { sku } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [imageSrc, setImageSrc] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const res = await axios.get("http://localhost:8000/products");
        const data = Array.isArray(res.data) ? res.data : res.data.products || [];
        setAllProducts(data);
      } catch (err) {
        console.error("שגיאה בטעינת מוצרים", err);
        setAllProducts([]);
      }
    };
    fetchAllProducts();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:8000/products/sku/${sku}`);
        const data = await res.json();
        setProduct(data);
        setImageSrc(`/images/${data.sku}.jpg`);
      } catch (err) {
        console.error("שגיאה בטעינת מוצר", err);
      }
    };
    fetchProduct();
  }, [sku]);

  const handleImageError = () => {
    if (imageSrc.endsWith(".jpg")) {
      setImageSrc(`/images/${sku}.png`);
    } else {
      setImageSrc("/images/default.jpg");
    }
  };

  // פונקציה להוספה לסל
  const handleAddToCart = () => {
    try {
      const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
      const productToAdd = {
        sku: product.sku,
        productName: product.productName,
        price: product.price,
        image: imageSrc,
        quantity: quantity,
      };
      
      const existingItem = existingCart.find((p) => p.sku === sku);
      
      const updatedCart = existingItem
        ? existingCart.map((p) =>
            p.sku === sku ? { ...p, quantity: p.quantity + quantity } : p
          )
        : [...existingCart, productToAdd];
      
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      window.dispatchEvent(new Event("storage"));
      navigate("/cart");
    } catch (error) {
      console.error("שגיאה בהוספה לסל:", error);
      alert("אירעה שגיאה בהוספה לסל");
    }
  };

  if (!product) return <div>טוען מוצר...</div>;

  const thumbnails = [1, 2, 3, 4, 5].map((i) => ({
    jpg: `/images/${sku}_${i}.jpg`,
    png: `/images/${sku}_${i}.png`
  }));

  return (
    <main className={styles.pageWrapper}>
      <div className={styles.searchStripWrapper}>
        <SearchStrip
          categories={allProducts.map(p => ({
            category: p.category,
            subcategory: p.subcategory,
            subsubcategory: p.subsubcategory
          }))}
        />
      </div>

      <div className={styles.topSection}>
        <div className={styles.imageSection}>
          <div className={styles.imageWrapper}>
            <img
              src={imageSrc}
              alt={product.productName}
              onError={handleImageError}
              className={styles.mainImage}
            />
          </div>

          {/* 🔍 טמבליינים */}
          <div className={styles.thumbnailList}>
            {thumbnails.map((thumb, i) => (
              <img
                key={i}
                src={thumb.jpg}
                alt={`thumb ${i + 1}`}
                className={styles.thumbnail}
                onClick={() => setImageSrc(thumb.jpg)}
                onError={(e) => {
                  if (e.target.src.endsWith(".jpg")) {
                    e.target.src = thumb.png;
                  } else {
                    e.target.style.display = "none";
                  }
                }}
              />
            ))}
          </div>
        </div>

        <div className={styles.details}>
          <img
            src={`/brands/${product.brandLogo?.trim() || "placeholder.jpg"}`}
            alt={product.brand}
            onError={(e) => {
              e.target.src = "/brands/placeholder.jpg";
            }}
            className={styles.brandLogo}
          />

          <h2 className={styles.name}>{product.productName}</h2>

          <div
            className={styles.shortDescription}
            dangerouslySetInnerHTML={{ __html: product.shortDescription }}
          />

          <div className={styles.priceBox}>
            <span className={styles.price}>
              {(Math.floor(product.price * 10) / 10).toFixed(2)} ₪
            </span>           
            {product.priceInstead && (
              <span className={styles.priceInstead}>{Math.round(product.priceInstead)} ₪</span>
            )}
          </div>

          <div className={styles.actions}>
            <select
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className={styles.quantitySelect}
            >
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            <img 
              src={addToCartImage}
              alt="הוסף לסל"
              onClick={handleAddToCart}
              className={styles.addToCart}
              style={{ cursor: 'pointer' }}
            />
          </div>

          <img src={reviewImage} alt="ביקורות" className={styles.review} />

          <p className={styles.metaLine}>
            {product.sku && <>מק"ט: {product.sku} | </>}
            {product.model && <>דגם: {product.model} | </>}
            {product.brand && <>מותג: {product.brand} | </>}
            {product.country && <>ארץ יצור: {product.country} | </>}
            {product.warranty && <>אחריות: {product.warranty}</>}
          </p>
          <p className={styles.caterorylist}>
            {product.category && <> {product.category}</>}
            {product.subcategory && <> / {product.subcategory}</>}
            {product.subsubcategory && <> / {product.subsubcategory}</>}
          </p>
        </div>
      </div>

      {/* תיאור ארוך */}
      <div className={styles.fullDescription}>
        <h2>תיאור מוצר</h2>
        <div dangerouslySetInnerHTML={{ __html: product.longDescription }} />
      </div>
    </main>
  );
};

export default ProductPage;
