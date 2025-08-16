import Joi from "joi";
import {
  CampaignStatus,
  CampaignType,
} from "./../../generated/prisma/index.js";
const createCampaignScheme = Joi.object({
  name: Joi.string().required().max(255),
  description: Joi.string().optional().allow(null),
  type: Joi.string()
    .required()
    .valid(...Object.values(CampaignType)),
  status: Joi.string()
    .required()
    .valid(...Object.values(CampaignStatus)),
  startDate: Joi.date().required().greater("now"),
  endDate: Joi.date().required().greater("now"),
  budget: Joi.number().required().positive(),
});

const updateCampaignScheme = Joi.object({
  name: Joi.string().optional().allow(null),
  description: Joi.string().optional().allow(null),
  type: Joi.string()
    .optional()
    .valid(...Object.values(CampaignType)),
  status: Joi.string()
    .optional()
    .valid(...Object.values(CampaignStatus)),
  startDate: Joi.date().optional().greater("now"),
  endDate: Joi.date().optional().greater("now"),
  budget: Joi.number().optional().positive(),
});

const campaignIdScheme = Joi.object({
  id: Joi.number().integer().required(),
});

const campaignQueryScheme = Joi.object({
  status: Joi.string()
    .optional()
    .valid(...Object.values(CampaignStatus)),
  type: Joi.string()
    .optional()
    .valid(...Object.values(CampaignType)),
}).unknown(false);

export {
  createCampaignScheme,
  updateCampaignScheme,
  campaignIdScheme,
  campaignQueryScheme,
};
