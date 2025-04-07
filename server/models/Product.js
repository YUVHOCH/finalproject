// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  sku: { type: Number, required: true, unique: true },
  productName: { type: String, required: true },
  titleDescription: { type: String },
  shortDescription: { type: String },
  fullDescription: { type: String },
  price: { type: Number, required: true },
  priceInstead: { type: Number },
  category: { type: String },
  brand: { type: String },
  dateCreation: { type: Date, default: Date.now }
});

// הקו התחתון כאן היה בטעות - userSchema → productSchema
module.exports = mongoose.model('Product', productSchema);
