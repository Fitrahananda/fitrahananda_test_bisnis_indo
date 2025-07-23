const { ValidationError, UniqueConstraintError } = require("sequelize");

module.exports = (err, req, res, next) => {
  console.error(err); // Log error detail (optional)

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors = err.errors || null;

  // ✅ Tangani Sequelize Validation Error
  if (err instanceof ValidationError || err instanceof UniqueConstraintError) {
    statusCode = 400;
    message = "Validation error";
    const constraintName = err.original?.constraint;
    if (constraintName === "users_username_key") {
      errors = { msg: "username already register" };
    } else if (constraintName === "users_email_key") {
      errors = { msg: "email already register" };
    } else {
      errors = err.errors.map((e) => ({
        param: e.path,
        msg: e.message,
      }));
    }
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};
