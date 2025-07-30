import Joi from "joi";
import { LeadStatus } from "./../../generated/prisma/index.js";
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
  status: Joi.string()
    .optional()
    .valid(...Object.values(LeadStatus))
    .messages({
      "string.valid":
        "Status must be one of the following: NEW, CONTACTED, WON, LOST",
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
  status: Joi.string()
    .valid(...Object.values(LeadStatus))
    .optional()
    .messages({
      "string.valid":
        "Status must be one of the following: NEW, CONTACTED, WON, LOST",
    }),
});

const leadStatusScheme = Joi.object({
  status: Joi.string()
    .valid(...Object.values(LeadStatus))
    .optional()
    .max(50)
    .messages({
      "string.valid":
        "Status must be one of the following: NEW, CONTACTED, WON, LOST",
    }),
});

const leadIdScheme = Joi.object({
  id: Joi.number().integer().required().messages({
    "any.required": "Lead ID is required",
    "number.base": "Lead ID must be a number",
    "number.integer": "Lead ID must be an integer",
  }),
});
export { createLeadScheme, updateLeadScheme, leadStatusScheme, leadIdScheme };
