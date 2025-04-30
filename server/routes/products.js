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

// 📊 שליפת מספר מוצרים פעילים לפי תת-תת-קטגוריה
router.get("/category-counts", async (req, res) => {
  try {
    const result = await Product.aggregate([
      { $match: { active: true } },
      {
        $group: {
          _id: "$subsubcategory",
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
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

// הוספת הנתיב החדש לעדכון שדה isSale
router.post('/admin/update-issale-field', async (req, res) => {
  try {
    const result = await Product.updateMany(
      { isSale: { $exists: false } },
      { $set: { isSale: false } }
    );

    res.status(200).json({ 
      message: "✅ השדה isSale עודכן בהצלחה", 
      modifiedCount: result.modifiedCount 
    });
  } catch (error) {
    console.error("❌ שגיאה בעדכון שדה isSale:", error);
    res.status(500).json({ message: error.message });
  }
});

// נתיב חדש לאתחול שדה isSale בכל המוצרים
router.post('/admin/init-sale-field', async (req, res) => {
  try {
    // מעדכן את כל המוצרים - מוסיף שדה isSale אם לא קיים
    const result = await Product.updateMany(
      { isSale: { $exists: false } },  // רק למוצרים שאין להם את השדה
      { $set: { isSale: false } }
    );

    res.json({
      message: "✅ שדה isSale אותחל בהצלחה",
      modifiedCount: result.modifiedCount,
      matchedCount: result.matchedCount
    });
  } catch (error) {
    console.error("שגיאה באתחול שדה isSale:", error);
    res.status(500).json({ message: error.message });
  }
});

// הוספת הנתיב החדש לעדכון מוצר במבצע
router.post('/test-sale', async (req, res) => {
  try {
    const testSku = 61906750;
    console.log("מנסה לעדכן מוצר למבצע:", testSku);  // לוג לדיבוג
    
    const result = await Product.findOneAndUpdate(
      { sku: testSku },
      { $set: { isSale: true } },
      { new: true }
    );

    if (!result) {
      console.log("מוצר לא נמצא");  // לוג לדיבוג
      return res.status(404).json({ message: "מוצר לא נמצא" });
    }

    console.log("מוצר עודכן בהצלחה:", result);  // לוג לדיבוג
    res.json({
      message: "✅ המוצר עודכן בהצלחה",
      product: result
    });

  } catch (error) {
    console.error("שגיאה בעדכון המוצר:", error);
    res.status(500).json({ message: error.message });
  }
});

// הוספת הנתיב החדש להוספת שדה isSale לכל המוצרים
router.post('/init-sale-field', async (req, res) => {
  try {
    // מעדכן את כל המוצרים שאין להם שדה isSale
    const result = await Product.updateMany(
      { isSale: { $exists: false } },  // מוצא את כל המוצרים ללא שדה isSale
      { $set: { isSale: false } }      // מגדיר להם ברירת מחדל false
    );

    res.json({
      message: "✅ השדה isSale הוגדר בהצלחה לכל המוצרים",
      modifiedCount: result.modifiedCount
    });

  } catch (error) {
    console.error("שגיאה בהוספת שדה isSale:", error);
    res.status(500).json({ message: error.message });
  }
});

// נתיב לעדכון סטטוס מבצע למוצר לפי מק"ט
router.post('/update-sale-status', async (req, res) => {
  try {
    const { sku, isSale } = req.body;
    
    const result = await Product.findOneAndUpdate(
      { sku: sku },
      { $set: { isSale: isSale } },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ message: "מוצר לא נמצא" });
    }

    res.json({
      message: `✅ סטטוס המבצע של המוצר ${sku} עודכן ל-${isSale}`,
      product: result
    });

  } catch (error) {
    console.error("שגיאה בעדכון סטטוס מבצע:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
