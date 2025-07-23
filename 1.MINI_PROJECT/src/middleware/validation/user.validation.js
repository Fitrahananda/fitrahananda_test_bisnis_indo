const Joi = require("joi");
const HttpError = require("../../utils/HttpError");

// User validation schemas
const userSchemas = {
  register: Joi.object({
    username: Joi.string().required().messages({
      "string.empty": "Username is required",
      "any.required": "Username is required",
    }),
    email: Joi.string().email().required().messages({
      "string.email": "Please include a valid email",
      "string.empty": "Email is required",
      "any.required": "Email is required",
    }),
    password: Joi.string().min(6).required().messages({
      "string.min": "Please enter a password with 6 or more characters",
      "string.empty": "Password is required",
      "any.required": "Password is required",
    }),
  }),
  login: Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Please include a valid email",
      "string.empty": "Email is required",
      "any.required": "Email is required",
    }),
    password: Joi.string().required().messages({
      "string.empty": "Password is required",
      "any.required": "Password is required",
    }),
  }),
};

// Validation middleware factory
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map((detail) => ({
        param: detail.path[0],
        msg: detail.message,
      }));

      throw new HttpError("Validation failed", 409, errors);
    }

    next();
  };
};

module.exports = {
  userValidation: {
    register: validate(userSchemas.register),
    login: validate(userSchemas.login),
  },
};
