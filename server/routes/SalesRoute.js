// routes/bills.js
const express = require("express");
const Bill = require("../models/Bill.js");
const ensureAuthenticated = require("../middlewares/Auth.js");
const Sales = require("../models/Sales.js");
const Product = require("../models/products.js");

const router = express.Router();

const getMonthlySales = async (months) => {
  const currentDate = new Date();
  const monthlySales = [];

  for (let i = 0; i < months; i++) {
    const startDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - i,
      1
    );
    const endDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - i + 1,
      0
    );

    const bills = await Bill.find({
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    let monthlyTotal = 0;
    bills.forEach((bill) => {
      monthlyTotal += bill.total;
    });

    monthlySales.push({
      month: startDate.toLocaleString("default", { month: "long" }),
      total: monthlyTotal,
    });
  }

  return monthlySales;
};

const saveSalesData = async () => {
  const bills = await Bill.find();

  let cash = 0;
  let online = 0;
  let pendingPayment = 0;
  let productsMap = new Map();
  let totalOrders = bills.length;
  const days =
    (new Date() - new Date(bills[0].createdAt)) / (1000 * 60 * 60 * 24);
  let averageOrdersPerDay = totalOrders / days;

  bills.forEach((bill) => {
    if (bill.paymentMode === "cash") {
      cash += bill.total;
    } else if (bill.paymentMode === "online") {
      online += bill.total;
    } else if (bill.paymentMode === "udari") {
      pendingPayment += bill.total;
    }

    if (productsMap.has(bill.productName)) {
      let product = productsMap.get(bill.productName);
      product.totalSales += bill.total;
      product.soldQuantity += bill.quantity;
    } else {
      productsMap.set(bill.productName, {
        name: bill.productName,
        totalSales: bill.total,
        soldQuantity: bill.quantity,
      });
    }
  });

  const products = Array.from(productsMap.values());

  const total = cash + online + pendingPayment;

  const existingSales = await Sales.findOne();

  const topSellingProducts = products
    .sort((a, b) => b.totalSales - a.totalSales)
    .slice(0, 3);
  const minAvailableStocks = await Product.find()
    .sort({ availableStock: 1 })
    .limit(3)
    .select("name availableStock quantity");

  const monthlySales = await getMonthlySales(4);

  if (existingSales) {
    existingSales.cash = cash;
    existingSales.online = online;
    existingSales.pendingPayment = pendingPayment;
    existingSales.total = total;
    existingSales.totalOrders = totalOrders;
    existingSales.totalProducts = products.length;
    existingSales.averageOrdersPerDay = averageOrdersPerDay;
    existingSales.products = products;
    existingSales.topSellingProducts = topSellingProducts;
    existingSales.minAvailableStocks = minAvailableStocks;
    existingSales.monthlySales = monthlySales;

    await existingSales.save();
    return existingSales;
  } else {
    const newSales = new Sales({
      cash,
      online,
      pendingPayment,
      total,
      totalOrders,
      totalProducts: products.length,
      averageOrdersPerDay,
      products,
      topSellingProducts,
      minAvailableStocks,
      monthlySales,
    });

    await newSales.save();
    return newSales;
  }
};

router.post("/save-sales", async (req, res) => {
  try {
    const salesData = await saveSalesData();
    res
      .status(200)
      .json({ message: "Sales data saved successfully", salesData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/get-sales", async (req, res) => {
  try {
    await saveSalesData();
    const sales = await Sales.find().sort({ createdAt: -1 });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
