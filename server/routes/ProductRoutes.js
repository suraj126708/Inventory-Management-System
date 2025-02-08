const router = require("express").Router();
const {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/ProductController");
const ensureAuthenticated = require("../middlewares/Auth");
const productImages = require("../models/ProductFileUpload");

// Product routes
router.get("/", ensureAuthenticated, getAllProducts);
router.get("/:id", ensureAuthenticated, getProductById);
router.post(
  "/",
  ensureAuthenticated,
  productImages.single("productImg"),
  addProduct
);
router.put(
  "/:id",
  ensureAuthenticated,
  productImages.single("productImg"),
  updateProduct
);
router.delete("/:id", ensureAuthenticated, deleteProduct);

// Error handling middleware
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

module.exports = router;
