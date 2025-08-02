import Joi from "joi";

const createProductScheme = Joi.object({
  name: Joi.string().required().max(255).messages({
    "string.max": "Name cannot exceed 255 characters",
    "any.required": "Name is required",
  }),
  price: Joi.number().precision(2).positive().required().messages({
    "number.base": "Price must be a number",
    "number.precision": "Price must have 2 decimal places",
    "number.positive": "Price must be a positive number",
    "any.required": "Price is required",
  }),
  description: Joi.string().optional().allow(null),
  isActive: Joi.boolean().optional().default(true),
});

const updateProductScheme = Joi.object({
  name: Joi.string().optional().max(255).messages({
    "string.max": "Name cannot exceed 255 characters",
  }),
  price: Joi.number().precision(2).positive().optional().messages({
    "number.base": "Price must be a number",
    "number.precision": "Price must have 2 decimal places",
    "number.positive": "Price must be a positive number",
  }),
  description: Joi.string().optional().allow(null),
  isActive: Joi.boolean().optional(),
});

const productIdScheme = Joi.object({
  id: Joi.number().integer().required(),
});

export { createProductScheme, updateProductScheme, productIdScheme };
