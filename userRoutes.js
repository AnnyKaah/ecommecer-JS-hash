const express = require("express");
const router = express.Router();
const { getUserProfile } = require("./userController.js");
const { protect } = require("./authMiddleware.js");

// We apply the 'protect' middleware to this route. It will be executed before the handler.
router.route("/profile").get(protect, getUserProfile);

module.exports = router;
