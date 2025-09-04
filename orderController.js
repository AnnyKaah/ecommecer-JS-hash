const Order = require("./order.js");
const Cart = require("./Cart.js");
const Product = require("./Product.js");

// @desc    Create new order from user's cart
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  const { shippingAddress } = req.body;

  try {
    // 1. Get the user's cart from the database
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }

    // 2. Create an array of order items and calculate total price based on current DB data
    // This is a critical server-side validation step.
    const orderItems = [];
    let totalPrice = 0;

    for (const item of cart.items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res
          .status(404)
          .json({ message: `Product not found: ${item.name}` });
      }
      if (item.quantity > product.stock) {
        return res
          .status(400)
          .json({ message: `Not enough stock for ${product.name}` });
      }

      orderItems.push({
        name: product.name,
        quantity: item.quantity,
        image: product.images[0],
        price: product.price, // Use the current price from the DB, not from the client
        product: product._id,
      });

      totalPrice += product.price * item.quantity;
    }

    // 3. Create the new order
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      totalPrice,
    });

    const createdOrder = await order.save();

    // 4. Update stock for each product and clear the user's cart
    for (const item of createdOrder.orderItems) {
      await Product.updateOne(
        { _id: item.product },
        { $inc: { stock: -item.quantity } }
      );
    }
    cart.items = [];
    await cart.save();

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Cancel an order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if the order belongs to the user
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Check if the order can be cancelled (e.g., only if 'Processing')
    if (order.status !== "Processing") {
      return res
        .status(400)
        .json({
          message: `Order cannot be cancelled. Status: ${order.status}`,
        });
    }

    // Restock items
    for (const item of order.orderItems) {
      await Product.updateOne(
        { _id: item.product },
        { $inc: { stock: item.quantity } }
      );
    }

    order.status = "Cancelled";
    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  addOrderItems,
  getMyOrders,
  cancelOrder,
};
