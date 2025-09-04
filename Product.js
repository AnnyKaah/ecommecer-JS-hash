const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    images: [{ type: String, required: true }],
    description: [
      {
        key: { type: String },
        value: { type: String },
      },
    ],
    price: { type: Number, required: true, default: 0 },
    oldPrice: { type: Number },
    installments: { type: String },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
