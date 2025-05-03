import React, { useEffect, useState } from "react";
import TiptapEditor from "../components/TiptapEditor";
import styles from "../styles/AdminProducts.module.css";
import { useNavigate } from "react-router-dom";
import UploadExcelButton from "../components/UploadExcelButton";


const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const navigate = useNavigate();
  const handleEdit = (sku) => {
  navigate(`/admin/products/edit/${sku}`);
};
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:8000/products");
      const data = await res.json();
      setProducts(data.products);
    } catch (err) {
      console.error("❌ Error loading products:", err);
    }
  };

  const handleDeleteAll = async () => {
    const firstConfirm = window.confirm("⚠️ Are you sure you want to delete ALL products?");
    if (!firstConfirm) return;
  
    const secondConfirm = window.confirm("❗ This action is irreversible. Are you REALLY sure?");
    if (!secondConfirm) return;
  
    try {
      const res = await fetch("http://localhost:8000/products/admin/delete-all", {
        method: "DELETE",
      });
      const data = await res.json();
      alert("🗑️ " + data.message);
      fetchProducts(); // רענון הרשימה
    } catch (err) {
      console.error("❌ Failed to delete:", err);
      alert("❌ Failed to delete products");
    }
  };

  const handleUploadFromJson = async () => {
    try {
      const res = await fetch("http://localhost:8000/products/admin/upload-json", {
        method: "POST",
      });
      const data = await res.json();
      alert(`✅ ${data.message} (${data.count || 0} products uploaded)`);
      fetchProducts(); // מרענן את הרשימה
    } catch (err) {
      console.error("❌ Failed to upload:", err);
      alert("❌ Failed to upload products");
    }
  };

  const handleAdd = () => {
    const newProduct = {
      shortDescription,
      longDescription,
      // כאן תוכל להרחיב עם שדות נוספים
    };
    console.log("🆕 Product to save:", newProduct);
    alert("Product saved (console only)");
  };

  const handleDelete = async (sku) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete product ${sku}?`);
    if (!confirmDelete) return;
  
    try {
      const res = await fetch(`http://localhost:8000/products/${sku}`, {
        method: "DELETE",
      });
      const data = await res.json();
      alert("🗑️ " + data.message);
      fetchProducts(); // מרענן את הטבלה
    } catch (err) {
      console.error("❌ Failed to delete product:", err);
      alert("❌ Could not delete product");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>🛠️ Admin: Products Management</h2>

    <div className={styles.actions}>
        <button onClick={handleDeleteAll} className={styles.deleteButton}>
          🗑️ Delete All Products
        </button>

        <button onClick={handleUploadFromJson} className={styles.uploadButton}>
          ⬆️ Upload from JSON
        </button>

        <UploadExcelButton onUploadSuccess={fetchProducts} />

    </div>
      
      <div className={styles.topActions}>
        <button onClick={handleAdd} className="bg-green-600 text-white px-3 py-1 rounded">
          ➕ Add Product
        </button>
        <input
          type="text"
          placeholder="🔍 Search by name or SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
      />
      </div>


      <div className="flex justify-between items-center mb-4">
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">SKU</th>
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">Title</th>
            <th className="border px-2 py-1">Short</th>
            <th className="border px-2 py-1">Long</th>
            <th className="border px-2 py-1">Price</th>
            <th className="border px-2 py-1">Instead</th>
            <th className="border px-2 py-1">Image</th>
            <th className="border px-2 py-1">Active</th>
            <th className="border px-2 py-1">isSale</th>
            <th className="border px-2 py-1">homeSaleProducts</th>
            <th className="border px-2 py-1">Actions</th>
           
          </tr>
        </thead>
        
        <tbody>
        {products.filter((prod) =>
            prod.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            prod.sku?.toString().includes(searchTerm)
          )
          .map((prod) => (
            <tr key={prod.sku}>
              <td className="border px-2 py-1">{prod.sku}</td>
              <td className="border px-2 py-1">{prod.productName}</td>
              <td className="border px-2 py-1">{prod.titleDescription}</td>
              <td className="border px-2 py-1">
                <div dangerouslySetInnerHTML={{ __html: prod.shortDescription }} />
              </td>
              <td className="border px-2 py-1">
                <div dangerouslySetInnerHTML={{ __html: (prod.longDescription || "").substring(0, 100) + "..." }} />
              </td>
              <td className="border px-2 py-1">{prod.price}</td>
              <td className="border px-2 py-1">{prod.priceInstead}</td>
              <td className="border px-2 py-1">
                <img src={prod.image} alt="pic" width="50" />
              </td>
              <td className="border px-2 py-1">{prod.isSale? "✅" : "❌"}</td>
              <td className="border px-2 py-1">{prod.homeSaleProducts? "✅" : "❌"}</td>
              <td className="border px-2 py-1">{prod.active ? "✅" : "❌"}</td>
              <td className="border px-2 py-1">
                <button onClick={() => handleEdit(prod.sku)} className="text-blue-600">Edit</button> |{" "}
                <button onClick={() => handleDelete(prod.sku)} className="text-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
        </table>

      </div>
    </div>
  );
};

export default AdminProducts;
