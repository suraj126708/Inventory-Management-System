const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  product_id: { type: String, required: true, unique: true },
  shop_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  sellingPrice: { type: Number, required: true },
  company: { type: String, required: true },
  expiryDate: { type: Date, required: true },
  image: { type: String, required: true },
  addedDate: { type: Date, default: Date.now },
  availableStock: { type: Number, required: true },
});

module.exports = mongoose.model("Product", productSchema);
