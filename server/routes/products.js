// C:\finalproject\server\routes\products.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

const {
  getAllProducts,
  addProducts,
  deleteProduct,
  updateProduct,
  deleteAllProducts,
  uploadProductsFromJson,
} = require('../controllers/productController');

// ✅ שים לב: הנתיב הזה צריך להיות לפני כל נתיב כללי!
router.get('/sku/:sku', async (req, res) => {
  try {
    const sku = req.params.sku;
    const product = await Product.findOne({ sku });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    console.error('❌ Error fetching product by SKU:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✔️ נתיבים רגילים
router.get('/', getAllProducts);
router.post('/', addProducts);
router.delete('/:sku', deleteProduct);
router.put('/:sku', updateProduct);
router.patch('/:sku', updateProduct); // אופציונלי

// ✔️ פעולות אדמין
router.delete('/admin/delete-all', deleteAllProducts);
router.post('/admin/upload-json', uploadProductsFromJson);

module.exports = router;
