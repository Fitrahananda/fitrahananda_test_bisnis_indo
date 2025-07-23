const HttpError = require("../utils/HttpError");

module.exports = (req, res, next) => {
  const methodsWithBody = ["POST", "PUT", "PATCH", "DELETE"];

  if (methodsWithBody.includes(req.method)) {
    const contentType = req.headers["content-type"]?.toLowerCase() || "";

    if (
      !contentType.includes("application/json") &&
      !contentType.includes("application/x-www-form-urlencoded")
    ) {
      throw new HttpError(
        "Unsupported Media Type. Content-Type must be 'application/json' or 'application/x-www-form-urlencoded'.",
        415
      );
    }
  }

  next();
};
