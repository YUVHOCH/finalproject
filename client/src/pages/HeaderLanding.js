import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "../styles/HeaderLanding.module.css";
import logo from "../assets/logo.png";
import { SHOW_SCREEN_EXAMPLES } from "../landingFlags";

const navLinksBase = [
  { navKey: "home", to: "/", label: "דף הבית" },
  { navKey: "about", to: "/about", label: "אודות" },
  { navKey: "screens", to: "/#screens", label: "פרויקטים", needsScreens: true },
  { navKey: "contact", to: "/#contact", label: "צרו קשר" },
];

const navLinks = navLinksBase.filter(
  (item) => !item.needsScreens || SHOW_SCREEN_EXAMPLES
);

const HeaderLanding = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname, hash } = useLocation();

  const closeMenu = () => setMenuOpen(false);

  const navItemClass = (navKey) => {
    let active = false;
    if (navKey === "home") {
      active = pathname === "/" && (hash === "" || hash === "#hero");
    } else if (navKey === "about") {
      active = pathname === "/about";
    } else if (navKey === "screens") {
      active = pathname === "/" && hash === "#screens";
    } else if (navKey === "contact") {
      active = pathname === "/" && hash === "#contact";
    }
    return active ? styles.navLinkActive : styles.navLink;
  };

  return (
    <header className={styles.header} dir="ltr">
      <div className={styles.inner}>
        <Link to="/" className={styles.logoLink}>
          <img src={logo} alt="Bizpoint" className={styles.logo} />
        </Link>
        <span className={styles.tagline}>E-Commerce experts</span>
        <nav className={styles.nav} dir="rtl">
          {navLinks.map(({ navKey, to, label }) => (
            <Link key={navKey} to={to} className={navItemClass(navKey)}>
              {label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          className={styles.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label="תפריט"
        >
          <span className={styles.hamburgerBar} />
          <span className={styles.hamburgerBar} />
          <span className={styles.hamburgerBar} />
        </button>
        <div className={styles.contactBlock}>
          <a href="tel:050-9130999" className={styles.phoneLink}>
            <span className={styles.phoneIcon} aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </span>
            050-9130999
          </a>
        </div>
      </div>
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ""}`} dir="rtl">
        {navLinks.map(({ navKey, to, label }) => (
          <Link
            key={navKey}
            to={to}
            className={navItemClass(navKey)}
            onClick={closeMenu}
          >
            {label}
          </Link>
        ))}
      </div>
    </header>
  );
};

export default HeaderLanding;
