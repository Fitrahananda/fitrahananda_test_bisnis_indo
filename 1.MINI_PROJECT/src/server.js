require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models");
const checkContentType = require("./middleware/checkContentType");
const errorHandler = require("./middleware/errorHandler");
// Import routes
const authRoutes = require("./routes/auth.routes");
const articleRoutes = require("./routes/article.routes");

// Initialize express app
const app = express();
app.use(checkContentType);
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Article Management System API" });
});

// 404 handler
app.use((req, res, next) => {
  const error = new Error(`Cannot ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});
// Error handling middleware
app.use(errorHandler);

// Set port and start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
  console.log(`Server is running on port ${PORT}`);
});
