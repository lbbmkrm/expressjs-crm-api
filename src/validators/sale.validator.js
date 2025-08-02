import Joi from "joi";

const createSaleScheme = Joi.object({
  customerId: Joi.number().integer().required().positive(),
  opportunityId: Joi.number().integer().optional().allow(null).positive(),
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.number().integer().required().positive(),
        quantity: Joi.number().integer().required().positive(),
      })
    )
    .required()
    .min(1),
});

const updateSaleStatusScheme = Joi.object({
  status: Joi.string().valid("COMPLETED", "CANCELLED").required(),
});

const saleIdScheme = Joi.object({
  id: Joi.number().integer().required(),
});

export { createSaleScheme, updateSaleStatusScheme, saleIdScheme };
