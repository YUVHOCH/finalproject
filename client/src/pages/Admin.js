// pages/Admin.js
import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Navigate, NavLink, Routes, Route, useLocation } from "react-router-dom";
import styles from "../styles/Admin.module.css";
import AdminProducts from "./AdminProducts";
import AdminUsers from "./AdminUsers";
import AdminOrders from "./AdminOrders";
import Editproducts from "./Editproducts";

const Admin = () => {
  const { user } = useContext(UserContext);
  const location = useLocation();

  if (user === null) return <p>Loading...</p>;
  if (!user || user.role !== "admin") return <Navigate to="/" replace />;

  // בדיקה לפי ה-URL כדי להפעיל כפתור נבחר
  const activeTab = location.pathname.split("/")[2] || "products";

  return (
    <div className={styles.container}>
      <h1>Admin Dashboard</h1>
      
      <div className={styles.navTabs}>
        <NavLink
          to="/admin/products"
          className={activeTab === "products" ? styles.activeTab : ""}
        >
          📦 Products
        </NavLink>
        <NavLink
          to="/admin/users"
          className={activeTab === "users" ? styles.activeTab : ""}
        >
          👥 Users
        </NavLink>
        <NavLink
          to="/admin/orders"
          className={activeTab === "orders" ? styles.activeTab : ""}
        >
          🧾 Orders
        </NavLink>
        <NavLink
          to="/admin/brands"
          className={activeTab === "brands" ? styles.activeTab : ""}
        >
          🏷️ Brands
        </NavLink>
      </div>

      <div className={styles.tabContent}>
        <Routes>
          <Route path="/" element={<Navigate to="products" />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/edit/:sku" element={<Editproducts />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="orders" element={<AdminOrders />} />
        </Routes>
      </div>

      {activeTab === "brands" && (
        <iframe src="/admin/brands" title="Brands Management" />
      )}
    </div>
  );
};

export default Admin;
