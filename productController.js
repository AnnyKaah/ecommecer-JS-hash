const Product = require("./Product.js");

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// You can add more functions here for creating, updating, and deleting products
// for an admin dashboard in the future.

// const createProduct = async (req, res) => { ... };
// const updateProduct = async (req, res) => { ... };
// const deleteProduct = async (req, res) => { ... };

module.exports = {
  getProducts,
  getProductById,
};
