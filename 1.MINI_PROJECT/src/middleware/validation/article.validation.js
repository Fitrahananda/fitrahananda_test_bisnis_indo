const Joi = require("joi");
const HttpError = require("../../utils/HttpError");

// Article validation schemas
const articleSchemas = {
  create: Joi.object({
    title: Joi.string().required().messages({
      "string.empty": "Title is required",
      "any.required": "Title is required",
    }),
    body: Joi.string().required().messages({
      "string.empty": "Content is required",
      "any.required": "Content is required",
    }),
  }),
  update: Joi.object({
    title: Joi.string().required().messages({
      "string.empty": "Title is required",
      "any.required": "Title is required",
    }),
    body: Joi.string().required().messages({
      "string.empty": "Content is required",
      "any.required": "Content is required",
    }),
  }),
  publish: Joi.object({
    status: Joi.string().required().valid("draft", "published").messages({
      "string.empty": "Status is required",
      "any.required": "Status is required",
      "any.only": "Status must be either 'draft' or 'published'",
      "string.base": "Status must be a string",
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
  articleValidation: {
    create: validate(articleSchemas.create),
    publish: validate(articleSchemas.publish),
    update: validate(articleSchemas.update),
  },
};
