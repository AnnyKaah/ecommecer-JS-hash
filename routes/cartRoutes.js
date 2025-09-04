const express = require("express");
const router = express.Router();
const {
  getCart,
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantity,
} = require("../cartController.js");
const { protect } = require("../authMiddleware.js");

// All routes here are protected and require a logged-in user
router.use(protect);

router.route("/").get(getCart).post(addItemToCart);

router
  .route("/:productId")
  .put(updateCartItemQuantity)
  .delete(removeItemFromCart);

module.exports = router;
