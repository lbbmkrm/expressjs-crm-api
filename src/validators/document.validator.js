import Joi from "joi";
import { DocumentType } from "./../../generated/prisma/index.js";

const createDocumentScheme = Joi.object({
  documentType: Joi.string()
    .required()
    .valid(...Object.values(DocumentType)),
  customerId: Joi.number().integer().optional().allow(null),
  contactId: Joi.number().integer().optional().allow(null),
  leadId: Joi.number().integer().optional().allow(null),
  opportunityId: Joi.number().integer().optional().allow(null),
  campaignId: Joi.number().integer().optional().allow(null),
  ticketId: Joi.number().integer().optional().allow(null),
  activityId: Joi.number().integer().optional().allow(null),
  saleId: Joi.number().integer().optional().allow(null),
  file: Joi.any().required(),
});

const updateDocumentScheme = Joi.object({
  documentType: Joi.string()
    .optional()
    .valid(...Object.values(DocumentType)),
  customerId: Joi.number().integer().optional().allow(null),
  contactId: Joi.number().integer().optional().allow(null),
  leadId: Joi.number().integer().optional().allow(null),
  opportunityId: Joi.number().integer().optional().allow(null),
  campaignId: Joi.number().integer().optional().allow(null),
  ticketId: Joi.number().integer().optional().allow(null),
  activityId: Joi.number().integer().optional().allow(null),
  saleId: Joi.number().integer().optional().allow(null),
  file: Joi.any().required(),
});

const documentIdScheme = Joi.object({
  id: Joi.number().integer().required(),
});

const documentTypeScheme = Joi.object({
  documentType: Joi.string()
    .optional()
    .valid(...Object.values(DocumentType)),
});

export {
  createDocumentScheme,
  updateDocumentScheme,
  documentIdScheme,
  documentTypeScheme,
};
