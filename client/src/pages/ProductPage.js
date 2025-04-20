import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "../styles/ProductPage.module.css";
import reviewImage from "../assets/reviews.jpg";
import SearchStrip from "../components/SearchStrip";

const ProductPage = () => {
  const { sku } = useParams();
  const [product, setProduct] = useState(null);
  const [imageSrc, setImageSrc] = useState("");
  const [quantity, setQuantity] = useState(1);

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

  if (!product) return <div>טוען מוצר...</div>;

  const thumbnails = [1, 2, 3, 4, 5].map((i) => ({
    jpg: `/images/${sku}_${i}.jpg`,
    png: `/images/${sku}_${i}.png`
  }));

  return (
    <main className={styles.pageWrapper}>
        <SearchStrip />
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
            <button className={styles.addToCart} title="הוסף לסל">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#ffffff" viewBox="0 0 24 24">
                <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 
                2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-2 
                .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM7.16 
                12l.84 2h8.9c.75 0 1.41-.41 
                1.75-1.03l3.24-5.97A1 1 0 0021 
                6H5.21l-.94-2H1v2h2l3.6 
                7.59-1.35 2.44C5.16 16.37 5 
                16.68 5 17a2 2 0 002 2h12v-2H7.42c-.14 
                0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 
                0 1.41-.41 1.75-1.03L23 6H6.16z" />
              </svg>
            </button>
          </div>

          <img src={reviewImage} alt="ביקורות" className={styles.review} />

          <p className={styles.metaLine}>
            {product.sku && <>מק"ט: {product.sku} | </>}
            {product.model && <>דגם: {product.model} | </>}
            {product.brand && <>מותג: {product.brand} | </>}
            {product.country && <>ארץ יצור: {product.country} | </>}
            {product.warranty && <>אחריות: {product.warranty}</>}
            <p className={styles.caterorylist}>
            {product.category && <> {product.category}</>}
            {product.subcategory && <> / {product.subcategory}</>}
            {product.subsubcategory && <> / {product.subsubcategory}</>}
            </p>
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
