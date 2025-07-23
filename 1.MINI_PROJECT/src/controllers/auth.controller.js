const jwt = require("jsonwebtoken");
const { User } = require("../models");
const HttpError = require("../utils/HttpError");
// Register a new user
exports.register = async (req, res, next) => {
  // Check for validation errors

  const { username, email, password } = req.body;

  try {
    // Create new user
    const user = await User.create({
      username,
      email,
      password,
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        token,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Login user
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.checkPassword(password))) {
      throw new HttpError("Invalid credentials", 404);
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
      },
    });
    res.json({
      message: "Login successful",
      token,
      user,
    });
  } catch (err) {
    next(err);
  }
};

// Get current user profile
exports.getProfile = async (req, res, next) => {
  try {
    const { id } = req.user;
    const user = await User.findByPk(id);
    res.status(200).json({
      success: true,
      message: "get successful",
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }
};
