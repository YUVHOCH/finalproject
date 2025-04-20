const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  sku: { type: Number, required: true, unique: true },
  productName: String,
  brand: String,
  brandLogo: String,
  model: String,
  price: Number,
  priceInstead: Number,
  image: String,
  active: Boolean,
  // 🆕 קטגוריות לפי עומק
  category: String,
  subcategory: String,
  subsubcategory: String,

  titleDescription: String,
  shortDescription: String,
  longDescription: String,
  country: String,
  warranty: String,
  dateCreation: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Product", productSchema);
