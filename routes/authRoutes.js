const express = require("express");
const router = express.Router();
const {
  authUser,
  registerUser,
  forgotPassword,
  resetPassword,
} = require("../authController.js");

router.post("/login", authUser);
router.post("/register", registerUser);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

module.exports = router;
