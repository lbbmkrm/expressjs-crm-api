import Joi from "joi";

const createNoteScheme = Joi.object({
  content: Joi.string().required().messages({
    "string.empty": "Content cannot be empty",
    "any.required": "Content is required",
  }),
  customerId: Joi.number().integer().optional().allow(null).messages({
    "number.base": "Customer ID must be a number",
    "number.integer": "Customer ID must be an integer",
  }),
  contactId: Joi.number().integer().optional().allow(null).messages({
    "number.base": "Contact ID must be a number",
    "number.integer": "Contact ID must be an integer",
  }),
  leadId: Joi.number().integer().optional().allow(null).messages({
    "number.base": "Lead ID must be a number",
    "number.integer": "Lead ID must be an integer",
  }),
  opportunityId: Joi.number().integer().optional().allow(null).messages({
    "number.base": "Opportunity ID must be a number",
    "number.integer": "Opportunity ID must be an integer",
  }),
});

const updateNoteScheme = Joi.object({
  content: Joi.string().optional().trim().min(1).messages({
    "string.empty": "Content cannot be empty",
    "string.min": "Content cannot be empty",
  }),
  customerId: Joi.number().integer().optional().allow(null).messages({
    "number.base": "Customer ID must be a number",
    "number.integer": "Customer ID must be an integer",
  }),
  contactId: Joi.number().integer().optional().allow(null).messages({
    "number.base": "Contact ID must be a number",
    "number.integer": "Contact ID must be an integer",
  }),
  leadId: Joi.number().integer().optional().allow(null).messages({
    "number.base": "Lead ID must be a number",
    "number.integer": "Lead ID must be an integer",
  }),
  opportunityId: Joi.number().integer().optional().allow(null).messages({
    "number.base": "Opportunity ID must be a number",
    "number.integer": "Opportunity ID must be an integer",
  }),
});
const noteIdScheme = Joi.object({
  id: Joi.number().integer().required().messages({
    "any.required": "Note ID is required",
    "number.base": "Note ID must be a number",
    "number.integer": "Note ID must be an integer",
  }),
});
export { createNoteScheme, updateNoteScheme, noteIdScheme };
