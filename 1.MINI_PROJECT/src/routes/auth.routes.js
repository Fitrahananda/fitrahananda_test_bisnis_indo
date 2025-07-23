const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware.js");
const {
  userValidation,
} = require("../middleware/validation/user.validation.js");
// Import controllers
const authController = require("../controllers/auth.controller");

// Register a new user
router.post("/register", userValidation.register, authController.register);

// Login user
router.post("/login", userValidation.login, authController.login);

// Get current user profile
router.use(authMiddleware);

router.get("/profile", authController.getProfile);

module.exports = router;
