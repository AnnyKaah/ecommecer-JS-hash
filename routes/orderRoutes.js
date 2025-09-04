const express = require("express");
const router = express.Router();
const {
  addOrderItems,
  getMyOrders,
  cancelOrder,
} = require("../orderController.js");
const { protect } = require("../authMiddleware.js");

// All routes in this file are protected and require a logged-in user
router.use(protect);

router.route("/").post(addOrderItems);
router.route("/myorders").get(getMyOrders);
router.route("/:id/cancel").put(cancelOrder);

module.exports = router;
