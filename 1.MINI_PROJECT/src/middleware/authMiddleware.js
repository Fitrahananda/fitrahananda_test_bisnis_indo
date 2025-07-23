const jwt = require("jsonwebtoken");
const HttpError = require("../utils/HttpError");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Harus format: "Bearer <token>"
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new HttpError("Token not found", 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.id) {
      throw new HttpError("invalid token", 401);
    }
    req.user = decoded; // isi: { id, email, ... }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authMiddleware;
