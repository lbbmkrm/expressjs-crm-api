import Joi from "joi";
import { TaskStatus, TaskPriority } from "./../../generated/prisma/index.js";
const createTaskScheme = Joi.object({
  name: Joi.string().required().max(255).messages({
    "string.max": "Name cannot exceed 255 characters",
    "any.required": "Name is required",
  }),
  description: Joi.string().optional().allow(null).max(255).messages({
    "string.max": "Description cannot exceed 255 characters",
  }),
  priority: Joi.string()
    .valid(...Object.values(TaskPriority))
    .default(TaskPriority.LOW)
    .messages({
      "any.only": "Priority must be one of the following: LOW, MEDIUM, HIGH",
    }),
  dueDate: Joi.date().required().min("now").messages({
    "date.min": "Due date must be in the future",
    "date.base": "Due date must be a valid date",
    "any.required": "Due date is required",
  }),
  customerId: Joi.number().integer().optional().allow(null).messages({
    "number.base": "Customer ID must be a number",
    "number.integer": "Customer ID must be an integer",
  }),
  leadId: Joi.number().integer().optional().allow(null).messages({
    "number.base": "Lead ID must be a number",
    "number.integer": "Lead ID must be an integer",
  }),
  opportunityId: Joi.number().integer().optional().allow(null).messages({
    "number.base": "Opportunity ID must be a number",
    "number.integer": "Opportunity ID must be an integer",
  }),
  assignedToUserId: Joi.number().integer().required().messages({
    "number.base": "Assigned to user ID must be a number",
    "any.required": "Assigned to user ID is required",
  }),
});

const updateTaskScheme = Joi.object({
  name: Joi.string().optional().allow(null).max(255).messages({
    "string.max": "Name cannot exceed 255 characters",
  }),
  description: Joi.string().optional().allow(null).max(255).messages({
    "string.max": "Description cannot exceed 255 characters",
  }),
  status: Joi.string()
    .optional()
    .valid(...Object.values(TaskStatus))
    .messages({
      "any.only":
        "Status must be one of the following: PENDING, IN_PROGRESS, COMPLETED, CANCELLED",
    }),
  priority: Joi.string()
    .optional()
    .valid(...Object.values(TaskPriority))
    .messages({
      "any.only": "Priority must be one of the following: LOW, MEDIUM, HIGH",
    }),
  dueDate: Joi.date().optional().min("now").messages({
    "date.min": "Due date must be in the future",
    "date.base": "Due date must be a valid date",
  }),
  customerId: Joi.number().integer().optional().allow(null).messages({
    "number.base": "Customer ID must be a number",
    "number.integer": "Customer ID must be an integer",
  }),
  leadId: Joi.number().integer().optional().allow(null).messages({
    "number.base": "Lead ID must be a number",
    "number.integer": "Lead ID must be an integer",
  }),
  opportunityId: Joi.number().integer().optional().allow(null).messages({
    "number.base": "Opportunity ID must be a number",
    "number.integer": "Opportunity ID must be an integer",
  }),
  assignedToUserId: Joi.number().integer().optional().allow(null).messages({
    "number.base": "Assigned to user ID must be a number",
    "number.integer": "Assigned to user ID must be an integer",
  }),
});
const taskIdScheme = Joi.object({
  id: Joi.number().integer().required().messages({
    "any.required": "Task ID is required",
    "number.base": "Task ID must be a number",
    "number.integer": "Task ID must be an integer",
  }),
});
const taskQueryScheme = Joi.object({
  status: Joi.string()
    .optional()
    .valid(...Object.values(TaskStatus)),
  priority: Joi.string()
    .optional()
    .valid(...Object.values(TaskPriority)),
  assignedUserId: Joi.number().integer().optional(),
});
export { createTaskScheme, updateTaskScheme, taskIdScheme, taskQueryScheme };
