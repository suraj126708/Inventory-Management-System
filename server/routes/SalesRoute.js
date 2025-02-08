// routes/bills.js
const express = require("express");
const Bill = require("../models/Bill.js");
const ensureAuthenticated = require("../middlewares/Auth.js");
const Sales = require("../models/Sales.js");
const Product = require("../models/products.js");

const router = express.Router();

router.post("/save-sales", ensureAuthenticated, async (req, res) => {
  try {
    const bills = await Bill.find();

    let cash = 0;
    let online = 0;
    let pendingPayment = 0;
    let productsMap = new Map();

    // Process each bill
    bills.forEach((bill) => {
      // Categorize by payment mode
      if (bill.paymentMode === "cash") {
        cash += bill.total;
      } else if (bill.paymentMode === "online") {
        online += bill.total;
      } else if (bill.paymentMode === "udari") {
        pendingPayment += bill.total;
      }

      // Aggregate product sales
      if (productsMap.has(bill.productName)) {
        let product = productsMap.get(bill.productName);
        product.totalSales += bill.total;
      } else {
        productsMap.set(bill.productName, {
          name: bill.productName,
          totalSales: bill.total,
        });
      }
    });

    // Calculate sold quantity for each product
    for (let [productName, productData] of productsMap) {
      const product = await Product.findOne({ name: productName });
      if (product) {
        productData.soldQuantity = product.quantity - product.availableStock;
      }
    }

    // Convert map to an array
    const products = Array.from(productsMap.values());

    // Calculate total sales
    const total = cash + online + pendingPayment;
    // Save the aggregated sales data

    const newSales = new Sales({
      cash,
      online,
      pendingPayment,
      total,
      products,
    });

    await newSales.save();
    res
      .status(201)
      .json({ message: "Sales data saved successfully", newSales });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/get-sales", async (req, res) => {
  try {
    const sales = await Sales.find().sort({ createdAt: -1 });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
