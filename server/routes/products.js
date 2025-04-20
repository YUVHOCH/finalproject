// 🛣️ Product Routes – ניהול נתיבים למוצרים
// server\routes\products.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const multer = require("multer");
const xlsx = require("xlsx");

const {
  getAllProducts,
  addProducts,
  deleteProduct,
  updateProduct,
  deleteAllProducts,
} = require('../controllers/productController');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// 🔁 שליפת מוצר לפי SKU
router.get('/sku/:sku', async (req, res) => {
  try {
    const sku = req.params.sku;
    const product = await Product.findOne({ sku });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 🔄 נתיבים רגילים
router.get('/', getAllProducts); // ⚠️ אל תגדיר עוד GET /products במקום אחר
router.post('/', addProducts);
router.delete('/:sku', deleteProduct);
router.put('/:sku', updateProduct);
router.patch('/:sku', updateProduct);

// 🔐 פעולות אדמין
router.delete('/admin/delete-all', deleteAllProducts);

// 📥 העלאת מוצרים מקובץ Excel (bulk upsert)
router.post('/admin/upload-excel', upload.single("excelFile"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  try {
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData = xlsx.utils.sheet_to_json(sheet);

    const productsToUpsert = rawData.map((row) => {
      const updateFields = {};
      if (row.productName) updateFields.productName = row.productName;
      if (row.category) updateFields.category = row.category;
      if (row.subcategory) updateFields.subcategory = row.subcategory;
      if (row.subsubcategory) updateFields.subsubcategory = row.subsubcategory;
      if (row.brand) updateFields.brand = row.brand;
      if (row.brandLogo) updateFields.brandLogo = row.brandLogo;
      if (row["Model Code"]) updateFields.model = row["Model Code"];
      if (row.titleDescription) updateFields.titleDescription = row.titleDescription;
      if (row.shortDescription) updateFields.shortDescription = row.shortDescription;
      if (row.longDescription) updateFields.longDescription = row.longDescription;
      if (row.price) updateFields.price = Number(row.price);
      if (row.priceInstead) updateFields.priceInstead = Number(row.priceInstead);
      if (row.country) updateFields.country = row.country;
      if (row.warranty) updateFields.warranty = row.warranty;
      if (row.image) updateFields.image = row.image;
      if (row.active !== undefined)
        updateFields.active = row.active === "TRUE" || row.active === true;
      updateFields.dateCreation = new Date();

      return {
        updateOne: {
          filter: { sku: row.sku },
          update: { $set: updateFields },
          upsert: true
        }
      };
    });

    await Product.bulkWrite(productsToUpsert);
    res.status(200).json({ message: "Excel upload (bulk upsert) successful", count: productsToUpsert.length });
  } catch (err) {
    res.status(500).json({ message: "Server error during Excel upload", error: err.message });
  }
});

// 🆔 עדכון שדה model בלבד
router.post('/admin/update-models', upload.single("excelFile"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet);
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
});

module.exports = router;
