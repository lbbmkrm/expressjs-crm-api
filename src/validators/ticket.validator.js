import Joi from "joi";
import { TicketStatus } from "./../../generated/prisma/index.js";

const createTicketScheme = Joi.object({
  subject: Joi.string().required(),
  description: Joi.string().optional().allow(null),
  customerId: Joi.number().integer().required(),
  assignedToUserId: Joi.number().integer().required(),
});

const updateTicketScheme = Joi.object({
  subject: Joi.string().optional().allow(null),
  description: Joi.string().optional().allow(null),
  assignedToUserId: Joi.number().integer().optional().allow(null),
  status: Joi.string()
    .optional()
    .valid(...Object.values(TicketStatus)),
});

const ticketIdScheme = Joi.object({
  id: Joi.number().integer().required(),
});
const ticketQueryScheme = Joi.object({
  status: Joi.string()
    .optional()
    .valid(...Object.values(TicketStatus)),
  creator: Joi.number().integer().optional(),
});
export {
  createTicketScheme,
  updateTicketScheme,
  ticketIdScheme,
  ticketQueryScheme,
};
