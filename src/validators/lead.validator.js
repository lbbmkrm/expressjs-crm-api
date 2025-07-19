import Joi from "joi";
const createLeadScheme = Joi.object({
  customerId: Joi.number().integer().optional().allow(null).messages({
    "number.base": "Customer ID must be a number",
  }),
  name: Joi.string().required().max(100).messages({
    "string.max": "Name cannot exceed 100 characters",
    "any.required": "Name is required",
  }),
  email: Joi.string().optional().allow(null).email().max(100).messages({
    "string.email": "Invalid email format",
    "string.max": "Email cannot exceed 100 characters",
  }),
  phone: Joi.string().optional().allow(null).max(20).messages({
    "string.max": "Phone number cannot exceed 20 characters",
  }),
  status: Joi.string().required().max(50).messages({
    "string.max": "Status cannot exceed 50 characters",
    "any.required": "Status is required",
  }),
});

const updateLeadScheme = Joi.object({
  customerId: Joi.number().integer().optional().allow(null).messages({
    "number.base": "Customer ID must be a number",
  }),
  name: Joi.string().optional().max(100).messages({
    "string.max": "Name cannot exceed 100 characters",
  }),
  email: Joi.string().optional().email().max(100).messages({
    "string.email": "Invalid email format",
    "string.max": "Email cannot exceed 100 characters",
  }),
  phone: Joi.string().optional().max(20).messages({
    "string.max": "Phone number cannot exceed 20 characters",
  }),
  status: Joi.string().optional().max(50).messages({
    "string.max": "Status cannot exceed 50 characters",
  }),
});

export { createLeadScheme, updateLeadScheme };
