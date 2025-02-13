const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const path = require("path");
const QRCode = require("qrcode");

const AuthRouter = require("./routes/AuthRouter");
const ProductRoute = require("./routes/ProductRoutes");
const BillsRoute = require("./routes/BillRoutes");
const SalesRoute = require("./routes/SalesRoute");
const contactUs = require("./routes/ContactUsRoute");

const app = express();
require("dotenv").config();
require("./models/db");

const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use("/ShopImages", express.static(path.join(__dirname, "ShopImages")));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  "/ProductImages",
  express.static(path.join(__dirname, "ProductImages"))
);

app.use("/api/auth", AuthRouter);
app.use("/api/products", ProductRoute);
app.use("/api/bills", BillsRoute);
app.use("/api/sales", SalesRoute);
app.use("/api/contact", contactUs);

app.get("/ping", (req, res) => {
  res.send("hello server");
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
