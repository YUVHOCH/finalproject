// components/ProductCard.js
import React from "react";
import styles from "../styles/ProductCard.module.css";
import reviewImage from "../assets/reviews.jpg";

const ProductCard = ({
  image,
  productName,
  titleDescription,
  shortDescription,
  fullDescription,
  price,
  priceInstead,
  sku,
  category,
  brand
}) => {
  console.log("🟢 ProductCard props:", {
    productName,
    sku,
    brand,
    price
  });
  // קישורים יחסיים לתמונות מתוך public
  const imageSrc = `/images/${sku}.jpg`;
  const brandSrc = `/brands/${brand}.jpg`;

  return (
    <div className={styles.card}>
      <div className={styles.left}>
        {brand && (
          <img
            src={brandSrc}
            alt={`${brand} logo`}
            className={styles.brand}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/brands/default.jpg";
            }}
          />
        )}

        <img
          src={imageSrc}
          alt={productName}
          className={styles.image}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/images/default.jpg";
          }}
        />
      </div>

      <div className={styles.rightpart}>
        <h3 className={styles.productName}>{productName}</h3>
        <p className={styles.shortdescription}>{shortDescription}</p>

        <p className={styles.price}>
          Price: {price} ₪{" "}
          {priceInstead && (
            <span className={styles.priceinstead}>{priceInstead} ₪</span>
          )}
        </p>

        <div className={styles.meta}>
          <p className={styles.sku}>SKU: {sku}</p>
          <p className={styles.category}>Category: {category}</p>

          <img
            src={reviewImage}
            alt="customer reviews"
            className={styles.review}
          />
        </div>

        <button className={styles.cartButton}>🛒 Add to Cart</button>
      </div>
    </div>
  );
};

export default ProductCard;
