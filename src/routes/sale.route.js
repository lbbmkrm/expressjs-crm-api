import express from "express";
import saleController from "../controllers/sale.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import policyMiddleware from "../middlewares/policy.middleware.js";
import salePolicy from "../policies/sale.policy.js";
import {
  createSaleScheme,
  updateSaleStatusScheme,
  saleIdScheme,
} from "../validators/sale.validator.js";
import saleService from "../services/sale.service.js";
const router = express.Router();

router.get(
  "/",
  authMiddleware,
  policyMiddleware(salePolicy, "canViewAll"),
  saleController.index
);

router.get(
  "/:id",
  authMiddleware,
  policyMiddleware(salePolicy, "canView"),
  saleController.show
);
router.post(
  "/",
  authMiddleware,
  validate(createSaleScheme),
  policyMiddleware(salePolicy, "canCreate"),
  saleController.create
);

router.patch(
  "/:id",
  authMiddleware,
  validate(saleIdScheme, "params"),
  validate(updateSaleStatusScheme),
  policyMiddleware(salePolicy, "canUpdate", {
    needModel: true,
    serviceMethod: saleService.getSaleById,
  }),
  saleController.update
);

export default router;
