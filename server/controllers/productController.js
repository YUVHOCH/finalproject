// server/controllers/productController.js
const Product = require('../models/Product');

const getAllProducts = async (req, res) => {
  try {
    const search = req.query.search?.toLowerCase() || "";
    const category = req.query.category?.toLowerCase() || "";
    const query = {};

    if (search) {
      const skuAsNumber = Number(search);
      const skuCondition = !isNaN(skuAsNumber) ? { sku: skuAsNumber } : null;
    
      query.$or = [
        { productName: new RegExp(search, "i") },
        { brand: new RegExp(search, "i") },
        ...(skuCondition ? [skuCondition] : [])
      ];
    }

    if (category) {
      query.category = new RegExp(category, "i");
    }

    const products = await Product.find(query); // ❌ ללא skip/limit
    res.json({ products });
  } catch (error) {
    console.error("❌ Error in getAllProducts:", error.message);
    res.status(500).json({ message: error.message });
  }
};


// ➕ הוספת מוצרים חדשים (POST /products)
const addProducts = async (req, res) => {
  try {
    const data = req.body;
    if (!Array.isArray(data)) {
      return res.status(400).json({ message: "Request body must be an array of products" });
    }
    const result = await Product.insertMany(data);
    res.status(201).json({ message: "✅ Products added successfully", result });
  } catch (error) {
    console.error("❌ Error adding products:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// ❌ מחיקת מוצר לפי SKU (DELETE /products/:sku)
const deleteProduct = async (req, res) => {
  try {
    const sku = parseInt(req.params.sku);
    const result = await Product.findOneAndDelete({ sku });
    if (!result) return res.status(404).json({ message: "Product not found" });
    res.json({ message: `Product with SKU ${sku} deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✏️ עדכון מוצר לפי SKU (PUT /products/:sku)
const updateProduct = async (req, res) => {
  const { sku } = req.params;
  const updatedProduct = req.body;
  try {
    const result = await Product.findOneAndUpdate({ sku }, { $set: updatedProduct }, { new: true });
    if (!result) return res.status(404).json({ message: "Product not found" });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🧨 מחיקת כל המוצרים (DELETE /products/admin/delete-all)
const deleteAllProducts = async (req, res) => {
  try {
    await Product.deleteMany({});
    res.status(200).json({ message: "🗑️ All products deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete products" });
  }
};

// 🆔 עדכון שדה model בלבד
const updateModels = async (req, res) => {
  try {
    const xlsx = require("xlsx");
    const rows = xlsx.utils.sheet_to_json(
      xlsx.read(req.file.buffer, { type: "buffer" }).Sheets["Sheet1"]
    );

    const updateResults = [];

    for (const row of rows) {
      if (!row.sku || !row["Model Code"]) continue;

      const updated = await Product.findOneAndUpdate(
        { sku: row.sku },
        { model: row["Model Code"] },
        { new: true }
      );

      updateResults.push({
        sku: row.sku,
        model: row["Model Code"],
        status: updated ? "updated" : "not found"
      });
    }

    res.status(200).json({ message: "Models updated", results: updateResults });
  } catch (err) {
    console.error("❌ Error updating models:", err.message);
    res.status(500).json({ message: "Error updating models", error: err.message });
  }
};

module.exports = {
  getAllProducts,
  addProducts,
  deleteProduct,
  updateProduct,
  deleteAllProducts,
  updateModels
};
