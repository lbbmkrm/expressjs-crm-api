import Joi from "joi";
const registerSchema = Joi.object({
  username: Joi.string().required().min(3).max(30).messages({
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

const loginSchema = Joi.object({
  email: Joi.string().required().email().messages({
    "string.email": "Invalid email format",
    "any.required": "Email is required",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required",
  }),
});

export { registerSchema, loginSchema };
