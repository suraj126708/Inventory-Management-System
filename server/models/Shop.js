const mongoose = require("mongoose");

const ShopSchema = new mongoose.Schema(
  {
    shopName: { type: String, required: true },
    shopType: { type: String, required: true },
    shopAddress: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    shopPhoto: { type: String, default: null },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Shop", ShopSchema);
