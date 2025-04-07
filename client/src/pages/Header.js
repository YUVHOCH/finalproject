// pages/Header.js
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import styles from "../styles/Header.module.css";
import logo from "../assets/logo.png";
import cartIcon from "../assets/cart.png";
import wishlistIcon from "../assets/wishlist.png";
import loginIcon from "../assets/login.png";
import SearchBarWithCategory from "../components/SearchBarWithCategory";
import { useTranslation } from "react-i18next";

const Header = () => {
  const { t } = useTranslation();
  const { user, setUser } = useContext(UserContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={styles["header-container"]}>
      <div className={styles["header-inner"]}>
        <div className={styles.headerLeftSection}>
          <img src={logo} alt="Logo" className={styles.headerLogo} />
          <div className={styles.headerUserInfo}>
          <p className={styles.headerUsername}>
            {t("header.hello")}, {user?.username || t("header.guest")}
          </p>
                    
            {user && (
              <button className={styles.logoutButton} onClick={handleLogout}>
                🔓 Logout
              </button>
            )}
          </div>
        </div>

        <nav className={styles["header-nav"]}>
        <Link to="/">{t("header.home")}</Link>
        <Link to="/products">{t("header.products")}</Link>
        <Link to="/brands">{t("header.brands")}</Link>
        <Link to="/contact">{t("header.contact")}</Link>

        {!user && <Link to="/login">{t("header.login")}</Link>}
        {!user && <Link to="/register">{t("header.register")}</Link>}
        {user?.role === "admin" && <Link to="/admin">{t("header.admin")}</Link>}
        </nav>

        <div className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </div>

        <div className={styles["header-rightSection"]}>
          <div className={styles["header-icon"]}>
            <img src={cartIcon} alt="Cart" />
            <span className={styles["header-cartCount"]}>0</span>
          </div>
          <div className={styles["header-icon"]}>
            <img src={wishlistIcon} alt="Wishlist" />
          </div>
          <div className={styles["header-icon"]}>
            <img src={loginIcon} alt="Login" />
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className={styles.mobileMenu}>
          <Link to="/" onClick={closeMenu}><span>&gt;</span> {t("header.home")}</Link>
          <Link to="/products" onClick={closeMenu}><span>&gt;</span> {t("header.products")}</Link>
          <Link to="/brands" onClick={closeMenu}><span>&gt;</span> {t("header.brands")}</Link>
          <Link to="/contact" onClick={closeMenu}><span>&gt;</span> {t("header.contact")}</Link>

          {!user && (<Link to="/login" onClick={closeMenu}><span>&gt;</span> {t("header.login")} </Link>)}
          {!user && (<Link to="/register" onClick={closeMenu}><span>&gt;</span> {t("header.register")}</Link>)}
          {user?.role === "admin" && (<Link to="/admin" onClick={closeMenu}><span>&gt;</span> {t("header.admin")}</Link>)}
          <hr />
          <p className={styles.categoryTitle}>Categories</p>
          <Link to="/products?category=garden-tools" onClick={closeMenu}><span>&gt;</span> Garden Tools</Link>
          <Link to="/products?category=irrigation" onClick={closeMenu}><span>&gt;</span> Irrigation</Link>
          <Link to="/products?category=fertilising" onClick={closeMenu}><span>&gt;</span> Fertilising</Link>
          <Link to="/products?category=pest-control" onClick={closeMenu}><span>&gt;</span> Pest Control</Link>
        </div>
      )}
    </header>
  );
};

export default Header;
