// src/App.js – דף נחיתה Bizpoint (bizpoint.co.il)
// כשהאתר יעלה לפרודקשן: בכפתור "Powered by Bizpoint" באתרי הלקוחות יש לקשר לכתובת האתר הזה, לדוגמה:
// <a href="https://bizpoint.co.il">Powered by Bizpoint</a>

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HeaderLanding from "./pages/HeaderLanding";
import Landing from "./pages/Landing";
import About from "./pages/About";
import styles from "./styles/App.module.css";

function App() {
  return (
    <BrowserRouter>
      <div className={styles.app} dir="rtl">
        <HeaderLanding />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
        </Routes>
        <footer className={styles.footer}>
          <a
            href="https://bizpoint.co.il"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footerLink}
          >
            © Powered by Bizpoint
          </a>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
