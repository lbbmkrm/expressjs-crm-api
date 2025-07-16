import Joi from "joi";

const createContactScheme = Joi.object({
  customerId: Joi.number().required().messages({
    "any.required": "Customer ID is required",
  }),
  firstName: Joi.string().required().max(100).messages({
    "string.max": "First name cannot exceed 100 characters",
    "any.required": "First name is required",
  }),
  lastName: Joi.string().optional().allow(null).max(100).messages({
    "string.max": "Last name cannot exceed 100 characters",
  }),
  email: Joi.string().optional().allow(null).email().max(100).messages({
    "string.email": "Invalid email format",
    "string.max": "Email cannot exceed 100 characters",
  }),
  phone: Joi.string().optional().allow(null).max(20).messages({
    "string.max": "Phone number cannot exceed 20 characters",
  }),
  position: Joi.string().optional().allow(null).max(50).messages({
    "string.max": "Position cannot exceed 50 characters",
  }),
});

const updateContactScheme = Joi.object({
  firstName: Joi.string().optional().allow(null).max(100).messages({
    "string.max": "First name cannot exceed 100 characters",
  }),
  lastName: Joi.string().optional().allow(null).max(100).messages({
    "string.max": "Last name cannot exceed 100 characters",
  }),
  email: Joi.string().optional().allow(null).email().max(100).messages({
    "string.email": "Invalid email format",
    "string.max": "Email cannot exceed 100 characters",
  }),
  phone: Joi.string().optional().allow(null).max(20).messages({
    "string.max": "Phone number cannot exceed 20 characters",
  }),
});

export { createContactScheme, updateContactScheme };
