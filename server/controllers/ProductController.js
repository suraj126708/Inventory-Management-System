const Product = require("../models/products");
const path = require("path");
const fs = require("fs");

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ addedDate: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ product_id: req.params.id });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addProduct = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "File is missing!" });
  }

  try {
    const { name, quantity, totalPrice, sellingPrice, company, expiryDate } =
      req.body;

    const availableStock = quantity;

    if (
      !name ||
      !quantity ||
      !totalPrice ||
      !sellingPrice ||
      !company ||
      !expiryDate
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const imageData = req.file.path;

    const product = new Product({
      ...req.body,
      image: imageData,
      availableStock,
    });

    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const {
      name,
      quantity,
      totalPrice,
      sellingPrice,
      company,
      expiryDate,
      availableStock,
    } = req.body;
    if (
      !name ||
      !quantity ||
      !totalPrice ||
      !sellingPrice ||
      !company ||
      !expiryDate
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let updateData = { ...req.body, availableStock };

    // Handle new image if uploaded
    if (req.file) {
      updateData.image = req.file.path;
    }

    const product = await Product.findOneAndUpdate(
      { product_id: req.params.id },
      updateData,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ product_id: req.params.id });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete associated image file if it exists
    if (
      product.image &&
      product.image.startsWith("ShopImages/ProductImages/")
    ) {
      const imagePath = path.join(__dirname, "../", product.image);
      try {
        fs.unlinkSync(imagePath);
      } catch (err) {
        console.error("Error deleting image file:", err);
      }
    }

    await Product.deleteOne({ product_id: req.params.id });
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
};
