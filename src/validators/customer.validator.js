import Joi from "joi";

const createCustomerScheme = Joi.object({
  name: Joi.string().required().max(100).messages({
    "string.max": "Name cannot exceed 100 characters",
    "any.required": "Name is required",
  }),
  email: Joi.string().required().email().max(100).messages({
    "string.email": "Invalid email format",
    "string.max": "Email cannot exceed 100 characters",
    "any.required": "Email is required",
  }),
  phone: Joi.string().optional().allow(null).max(20).messages({
    "string.max": "Phone number cannot exceed 20 characters",
  }),
  address: Joi.string().optional().allow(null).max(255).messages({
    "string.max": "Address cannot exceed 255 characters",
  }),
  company: Joi.string().optional().allow(null).max(100).messages({
    "string.max": "Company name cannot exceed 100 characters",
  }),
});

const updateCustomerScheme = Joi.object({
  name: Joi.string().optional().allow(null).max(100).messages({
    "string.max": "Name cannot exceed 100 characters",
  }),
  email: Joi.string().optional().allow(null).email().max(100).messages({
    "string.email": "Invalid email format",
    "string.max": "Email cannot exceed 100 characters",
  }),
  phone: Joi.string().optional().allow(null).max(20).messages({
    "string.max": "Phone number cannot exceed 20 characters",
  }),
  address: Joi.string().optional().allow(null).max(255).messages({
    "string.max": "Address cannot exceed 255 characters",
  }),
  company: Joi.string().optional().allow(null).max(100).messages({
    "string.max": "Company name cannot exceed 100 characters",
  }),
});

export { createCustomerScheme, updateCustomerScheme };
