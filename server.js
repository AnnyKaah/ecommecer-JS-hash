const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables from .env file

const productRoutes = require("./routes/productRoutes.js");
const authRoutes = require("./routes/authRoutes.js");
const userRoutes = require("./userRoutes.js");
const cartRoutes = require("./routes/cartRoutes.js");
const orderRoutes = require("./routes/orderRoutes.js");

const app = express();

// --- Middlewares ---

// Permite que o servidor entenda requisições com corpo em JSON
app.use(express.json());

// !! IMPORTANTE: Esta linha serve todos os arquivos estáticos (HTML, CSS, JS, e IMAGENS)
app.use(express.static(path.join(__dirname, "public")));

// --- Rotas da API --- (Use the new structured routes)
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// API 404 Handler (Handles requests to /api/* that are not found)
app.use("/api", (req, res, next) => {
  res.status(404).json({ message: "API route not found" });
});

// Fallback to serve index.html for any route not handled by the API or static files
// This is useful for single-page applications (SPAs)
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Successfully connected to MongoDB.");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit the process with an error code
  }
};

startServer();
