import Joi from "joi";
import { Roles } from "./../../generated/prisma/index.js";
const createUserScheme = Joi.object({
  role: Joi.string()
    .optional()
    .valid(...Object.values(Roles))
    .messages({
      "any.required": "Role is required",
      "any.only":
        "Role must be one of the following: ADMIN, MANAGER, SALES, VIEWER",
    }),
  username: Joi.string().required().min(3).max(100).messages({
    "string.empty": "Username is required",
    "string.min": "Username must be at least 3 characters long",
    "string.max": "Username must be at most 30 characters long",
    "any.required": "Username is required",
  }),
  email: Joi.string().required().email().max(100).messages({
    "string.email": "Invalid email format",
    "string.empty": "Email is required",
    "string.max": "Email must be at most 100 characters long",
    "any.required": "Email is required",
  }),
  password: Joi.string().required().min(6).messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters long",
    "any.required": "Password is required",
  }),
});

const updateUserScheme = Joi.object({
  role: Joi.string()
    .valid(...Object.values(Roles))
    .messages({
      "any.only":
        "Role must be one of the following: ADMIN, MANAGER, SALES, VIEWER",
    }),
});
const userIdScheme = Joi.object({
  id: Joi.number().integer().required().messages({
    "number.base": "User ID must be a number",
    "number.integer": "User ID must be an integer",
    "any.required": "User ID is required",
  }),
});

export { createUserScheme, updateUserScheme, userIdScheme };
