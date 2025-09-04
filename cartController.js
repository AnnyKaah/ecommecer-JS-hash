const Cart = require("./Cart.js");
const Product = require("./Product.js");

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      // If no cart, create an empty one for the user
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Add item to cart or update quantity
// @route   POST /api/cart
// @access  Private
const addItemToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    const quantityToAdd = Number(quantity) || 1;

    if (itemIndex > -1) {
      // Item exists, update quantity
      const newQuantity = cart.items[itemIndex].quantity + quantityToAdd;
      if (newQuantity > product.stock) {
        return res.status(400).json({ message: "Not enough stock available" });
      }
      cart.items[itemIndex].quantity = newQuantity;
    } else {
      // New item
      if (quantityToAdd > product.stock) {
        return res.status(400).json({ message: "Not enough stock available" });
      }
      cart.items.push({
        product: productId,
        name: product.name,
        image: product.images[0],
        price: product.price,
        quantity: quantityToAdd,
      });
    }

    const updatedCart = await cart.save();
    res.status(201).json(updatedCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeItemFromCart = async (req, res) => {
  const { productId } = req.params;

  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    const updatedCart = await cart.save();
    res.json(updatedCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update item quantity in cart
// @route   PUT /api/cart/:productId
// @access  Private
const updateCartItemQuantity = async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  const newQuantity = Number(quantity);

  if (isNaN(newQuantity) || newQuantity <= 0) {
    return res.status(400).json({ message: "Invalid quantity" });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (newQuantity > product.stock) {
      return res.status(400).json({ message: "Not enough stock" });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not in cart" });
    }

    cart.items[itemIndex].quantity = newQuantity;
    const updatedCart = await cart.save();
    res.json(updatedCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getCart,
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantity,
};
