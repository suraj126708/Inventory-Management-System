// models/Bill.js
const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
  productName: String,
  quantity: Number,
  price: Number,
  total: Number,
  time: String,
  paymentMode: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Bill", billSchema);
