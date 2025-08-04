import Joi from "joi";

const upsertDashboardScheme = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional().allow(null),
  layout: Joi.object().required(),
});

export default upsertDashboardScheme;
