import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Home.module.css';

const FeaturedCategories = () => {
  const categories = [
    {
      name: "מחשבי השקייה",
      image: "/homecategories/computers.jpg",
      link: "/products/מחשבי השקיה"
    },
    {
      name: "גלגלות השקיה",
      image: "/homecategories/reelhoses.jpg",
      link: "/products/כלי גינון/מרססים/מרסס גב עד 20 ליטר"
    },
    {
      name: "כלים נטענים",
      image: "/homecategories/rechargeable.jpg",
      link: "/products/כלים נטענים"
    },
    {
      name: "מרססים",
      image: "/homecategories/sprayers.jpg",
      link: "/products/כלי גינון/מרססים/מרסס גב עד 20 ליטר"
    },
    {
      name: "הדברת עשבים",
      image: "/homecategories/grasspest.jpg",
      link: "/products/הדברת עשבים"
    },
    {
      name: "דשא סינטטי",
      image: "/homecategories/grass.jpg",
      link: "/products/דשא סינטטי"
    },
    {
      name: "מכסחות דשא",
      image: "/homecategories/lawnmowers.jpg",
      link: "/products/מכסחות דשא"
    },
    {
      name: "חרמשים",
      image: "/homecategories/trimmers.jpg",
      link: "/products/חרמשים"
    },
    {
      name: "מפוחי עלים",
      image: "/homecategories/blowers.jpg",
      link: "/products/מפוחי עלים"
    },
    {
      name: "מגזמות",
      image: "/homecategories/hedgetrimmers.jpg",
      link: "/products/מגזמות"
    },
    {
      name: "הדברת נמלים",
      image: "/homecategories/ants.jpg",
      link: "/products/הדברת נמלים"
    },
    {
      name: "דישון לגינה",
      image: "/homecategories/fertilisers.jpg",
      link: "/products/דישון/דישון לגינה/שחרור איטי"
    }
  ];

  return (
    <div className={styles.featuredCategories}>
      <h2 className={styles.featuredTitle}>קטגוריות נבחרות</h2>
      <div className={styles.categoriesGrid}>
        {categories.map((category, index) => (
          <Link 
            key={index} 
            to={category.link} 
            className={styles.categoryCard}
          >
            <div className={styles.categoryImageWrapper}>
              <img 
                src={category.image}
                alt={category.name} 
                className={styles.categoryImage}
                onError={(e) => {
                  if (e.target.src.endsWith('.png')) {
                    e.target.src = category.image.replace('.png', '.jpg');
                  }
                }}
              />
            </div>
            <span className={styles.categoryName}>{category.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FeaturedCategories; 