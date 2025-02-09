// routes/bills.js
const express = require("express");
const Bill = require("../models/Bill.js");
const ensureAuthenticated = require("../middlewares/Auth.js");
const Sales = require("../models/Sales.js");
const Product = require("../models/products.js");

const router = express.Router();

router.post("/save-bill", ensureAuthenticated, async (req, res) => {
  try {
    const product = await Product.findOne({ name: req.body.productName });
    if (product) {
      if (product.availableStock < req.body.quantity) {
        return res.status(400).json({ message: "Insufficient stock" });
      }
      product.availableStock -= req.body.quantity;
      await product.save();
    } else {
      return res.status(404).json({ message: "Product not found" });
    }

    const bill = new Bill(req.body);
    await bill.save();

    res.status(201).json({ message: "Bill saved successfully", bill });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/:id", ensureAuthenticated, async (req, res) => {
  console.log(req.body);

  const { quantity, paymentMethod, time } = req.body;
  if (!quantity || !paymentMethod) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const product = await Product.findOne({ product_id: req.params.id });
    console.log(product);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product) {
      if (product.availableStock < quantity) {
        return res.status(400).json({ message: "Insufficient stock" });
      }
      product.availableStock -= req.body.quantity;
      res.status(201).json({ message: "Bill saved successfully", bill });
    } else {
      return res.status(404).json({ message: "Product not found" });
    }

    const newBillItem = {
      productName: product.name,
      quantity: quantity,
      price: product.sellingPrice,
      total: product.sellingPrice * quantity,
      time: time,
      paymentMode: paymentMethod,
    };

    const bill = new Bill(newBillItem);
    await bill.save();

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/get-bills", ensureAuthenticated, async (req, res) => {
  try {
    const bills = await Bill.find().sort({ createdAt: -1 });
    res.json(bills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
