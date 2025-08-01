import Joi from "joi";
import { ActivityType } from "./../../generated/prisma/index.js";

const createActivityScheme = Joi.object({
  type: Joi.string()
    .required()
    .valid(...Object.values(ActivityType))
    .messages({
      "any.required": "Type is required",
      "any.only": "Invalid activity type",
    }),
  subject: Joi.string().required().max(255).messages({
    "any.required": "Subject is required",
    "string.max": "Subject cannot exceed 255 characters",
  }),
  content: Joi.string().required().messages({
    "any.required": "Content is required",
  }),
  customerId: Joi.number().integer().optional().allow(null),
  contactId: Joi.number().integer().optional().allow(null),
  leadId: Joi.number().integer().optional().allow(null),
  opportunityId: Joi.number().integer().optional().allow(null),
}).xor("customerId", "contactId", "leadId", "opportunityId");

const updateActivityScheme = Joi.object({
  type: Joi.string()
    .optional()
    .valid(...Object.values(ActivityType))
    .messages({
      "any.only": "Invalid activity type",
    }),
  subject: Joi.string().optional().max(255).messages({
    "string.max": "Subject cannot exceed 255 characters",
  }),
  content: Joi.string().optional(),
});

const activityIdScheme = Joi.object({
  id: Joi.number().integer().required(),
});

const relationQueryScheme = Joi.object({
  customerId: Joi.number().integer().optional(),
  contactId: Joi.number().integer().optional(),
  leadId: Joi.number().integer().optional(),
  opportunityId: Joi.number().integer().optional(),
  type: Joi.string().valid(...Object.values(ActivityType)).optional(),
});

export {
  createActivityScheme,
  updateActivityScheme,
  activityIdScheme,
  relationQueryScheme,
};
