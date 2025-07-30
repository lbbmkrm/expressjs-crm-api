import Joi from "joi";

const createOpportunityScheme = Joi.object({
  name: Joi.string().required().max(255).messages({
    "string.empty": "Name cannot be empty",
    "string.max": "Name cannot exceed 255 characters",
    "any.required": "Name is required",
  }),

  amount: Joi.number().precision(2).positive().required().messages({
    "number.base": "Amount must be a number",
    "number.precision": "Amount must have 2 decimal places",
    "number.positive": "Amount must be a positive number",
    "any.required": "Amount is required",
  }),

  stage: Joi.string()
    .valid(
      "QUALIFICATION",
      "NEED_ANALYSIS",
      "PROPOSAL_PRESENTATION",
      "NEGOTIATION",
      "WON",
      "LOST"
    )
    .default("QUALIFICATION")
    .messages({
      "any.only":
        "Stage must be one of the following: QUALIFICATION, NEED_ANALYSIS, PROPOSAL_PRESENTATION, NEGOTIATION, WON, LOST",
    }),

  closeDate: Joi.date().optional().messages({
    "date.base": "Close date must be a valid date",
  }),

  description: Joi.string().optional().allow(null).max(255).messages({
    "string.max": "Description cannot exceed 255 characters",
  }),

  leadId: Joi.number().optional().allow(null).integer().messages({
    "number.base": "Lead ID must be a number",
    "number.integer": "Lead ID must be an integer",
  }),

  customerId: Joi.number().optional().allow(null).integer().messages({
    "number.base": "Customer ID must be a number",
    "number.integer": "Customer ID must be an integer",
  }),
});

const updateOpportunityScheme = Joi.object({
  name: Joi.string().optional().max(255).messages({
    "string.max": "Name cannot exceed 255 characters",
  }),

  amount: Joi.number().optional().precision(2).positive().messages({
    "number.base": "Amount must be a number",
    "number.positive": "Amount must be a positive number",
  }),

  stage: Joi.string()
    .optional()
    .valid(
      "QUALIFICATION",
      "NEED_ANALYSIS",
      "PROPOSAL_PRESENTATION",
      "NEGOTIATION",
      "WON",
      "LOST"
    )
    .messages({
      "any.only":
        "Stage must be one of the following: QUALIFICATION, NEED_ANALYSIS, PROPOSAL_PRESENTATION, NEGOTIATION, WON, LOST",
    }),

  closeDate: Joi.date().optional().messages({
    "date.base": "Close date must be a valid date",
  }),

  description: Joi.string().optional().allow(null).max(255).messages({
    "string.max": "Description cannot exceed 255 characters",
  }),

  customerId: Joi.number().optional().allow(null).integer().messages({
    "number.base": "Customer ID must be a number",
    "number.integer": "Customer ID must be an integer",
  }),
});

const opportunityIdScheme = Joi.object({
  id: Joi.number().integer().required().messages({
    "any.required": "Opportunity ID is required",
    "number.base": "Opportunity ID must be a number",
    "number.integer": "Opportunity ID must be an integer",
  }),
});

export {
  createOpportunityScheme,
  updateOpportunityScheme,
  opportunityIdScheme,
};
