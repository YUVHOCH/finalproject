// ✅ src/components/ProductCard.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/ProductCard.module.css";
import reviewImage from "../assets/reviews.jpg";
import { useNavigate } from "react-router-dom";

const ProductCard = ({
  sku,
  productName,
  brand,
  brandLogo,
  model,
  price,
  priceInstead,
  image,
  shortDescription,
  longDescription,
  country,
  warranty,  
}) => {
  const navigate = useNavigate();
  const [imageSrc, setImageSrc] = useState(`/images/${sku}.jpg`);
  const [logoSrc, setLogoSrc] = useState(`/brands/${brandLogo?.trim() || "placeholder.jpg"}`);

  const handleImageError = () => {
    if (imageSrc.endsWith(".jpg")) {
      setImageSrc(`/images/${sku}.png`);
    } else {
      setImageSrc("/images/default.jpg");
    }
  };

  const handleLogoError = () => {
    if (logoSrc.endsWith(".jpg")) {
      setLogoSrc(logoSrc.replace(".jpg", ".png"));
    } else {
      setLogoSrc("/brands/placeholder.jpg");
    }
  };

  const thumbnails = [1, 2, 3].map((i) => ({
    jpg: `/images/${sku}_${i}.jpg`,
    png: `/images/${sku}_${i}.png`
  }));

  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const handleAddToCart = () => {
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const productToAdd = {
      sku,
      productName,
      price,
      image: imageSrc, 
      quantity: selectedQuantity,
    };
    
    const existingItem = existingCart.find((p) => p.sku === sku);

    const updatedCart = existingItem
  ? existingCart.map((p) =>
      p.sku === sku ? { ...p, quantity: p.quantity + selectedQuantity } : p
    )
  : [...existingCart, productToAdd];


      
  localStorage.setItem("cart", JSON.stringify(updatedCart));
  window.dispatchEvent(new Event("storage"));
    navigate("/cart");
  };

  return (
    <div className={styles.card}>
      {/* 🖼 תמונה ראשית מימין */}
      <div className={styles.imageSection}>
      <div className={styles.imageWrapper}>
        <img
          src={imageSrc}
          alt={productName}
          className={styles.mainImage}
          onError={handleImageError}
        />
      </div>

      {/* 🔍 תמונות נוספות – thumbnail */}
      <div className={styles.thumbnailList}>
        {thumbnails.map((thumb, idx) => (
          <img
            key={idx}
            src={thumb.jpg}
            alt={`thumb ${idx + 1}`}
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
      {/* ℹ️ תוכן משמאל */}
      <div className={styles.details}>
        <img
          src={logoSrc}
          alt={brand || "Brand logo"}
          className={styles.brandLogo}
          onError={handleLogoError}
        />

        <Link to={`/product/${sku}`} className={styles.productLink}>
          <h3 className={styles.name}>{productName}</h3>
        </Link>

        <div
          className={styles.shortDescription}
          dangerouslySetInnerHTML={{ __html: shortDescription }}
        />

        <div className={styles.priceBox}>
          <span className={styles.price}>{Math.round(price)} ₪</span>
          {priceInstead && (
            <span className={styles.priceInstead}>{Math.round(priceInstead)} ₪</span>
          )}
        </div>

        <div className={styles.actions}>
        <select
          className={styles.quantitySelect}
          value={selectedQuantity}
          onChange={(e) => setSelectedQuantity(parseInt(e.target.value))}
        >
          {[...Array(10)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>

          <button
            className={styles.addToCart}
            title="הוסף לסל"
            onClick={handleAddToCart}
          >          
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="#ffffff"
            viewBox="0 0 24 24"
          >
            <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm10 
                    0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM7.16 12l.84 
                    2h8.9c.75 0 1.41-.41 1.75-1.03l3.24-5.97A1 1 0 0021 6H5.21l-.94-2H1v2h2l3.6 
                    7.59-1.35 2.44C5.16 16.37 5 16.68 5 17a2 2 0 002 2h12v-2H7.42c-.14 
                    0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03L23 
                    6H6.16z" />
          </svg>

          </button>
          
          <Link to={`/product/${sku}`} className={styles.detailsButton}>
            לפרטים
          </Link>
        </div>

        <img src={reviewImage} alt="ביקורות" className={styles.review} />
        <p className={styles.metaLine}>
          {sku && <>מק"ט: {sku} | </>}
          {model && <>דגם: {model} | </>}
          {brand && <>מותג: {brand} | </>}
          {country && <>ארץ יצור: {country} | </>}
          {warranty && <>אחריות: {warranty}</>}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
