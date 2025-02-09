const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  totalSales: Number,
  soldQuantity: Number,
});

const minAvailableStockSchema = new mongoose.Schema({
  name: String,
  availableStock: Number,
  quantity: Number,
});

const salesSchema = new mongoose.Schema({
  cash: { type: Number, default: 0 },
  online: { type: Number, default: 0 },
  pendingPayment: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  totalOrders: { type: Number, default: 0 },
  totalProducts: { type: Number, default: 0 },
  products: [productSchema],
  topSellingProducts: [productSchema],
  minAvailableStocks: [minAvailableStockSchema],
  monthlySales: [
    {
      month: String,
      total: Number,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Sales", salesSchema);
