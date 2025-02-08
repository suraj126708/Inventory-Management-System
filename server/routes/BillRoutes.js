// routes/bills.js
const express = require("express");
const Bill = require("../models/Bill.js");
const ensureAuthenticated = require("../middlewares/Auth.js");
const Sales = require("../models/Sales.js");
const Product = require("../models/products.js");

const router = express.Router();

// Save a bill transaction
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

// // In your backend routes
// router.get("/:id", async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     if (product) {
//       if (product.availableStock < req.body.quantity) {
//         return res.status(400).json({ message: "Insufficient stock" });
//       }
//       product.availableStock -= req.body.quantity;
//       await product.save();
//     } else {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     const bill = new Bill(req.body);
//     await bill.save();

//     res.status(201).json({ message: "Bill saved successfully", bill });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

router.get("/get-bills", ensureAuthenticated, async (req, res) => {
  try {
    const bills = await Bill.find().sort({ createdAt: -1 });
    res.json(bills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
