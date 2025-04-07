// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import ProductsPage from "./pages/ProductsPage";
import Header from "./pages/Header";
import Register from "./pages/Register";
import LoginPage from "./pages/LoginPage";
import styles from "./styles/App.module.css";
import banner from "./assets/banner.jpg";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <div className={styles.app}>
          <div dir="rtl">
            <div className={styles.headerWrapper}>
              <Header />
              <div className={styles["banner-container"]}>
                <img
                  src={banner}
                  alt="main banner"
                  className={styles.bannerImage}
                />
              </div>
            </div>
  
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Admin />
                  </ProtectedRoute>
                }
              />
            </Routes>
  
            <footer className={styles.footer}>© 2025 My Garden Shop</footer>
          </div>
        </div>
      </UserProvider>
    </BrowserRouter>
  );
  }
  
  export default App;