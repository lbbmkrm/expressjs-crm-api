import express from "express";
import customerController from "../controllers/customer.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import policyMiddleware from "../middlewares/policy.middleware.js";
import customerPolicy from "../policies/customer.policy.js";
import validate from "../middlewares/validate.middleware.js";
import {
  createCustomerScheme,
  updateCustomerScheme,
  customerIdScheme,
} from "../validators/customer.validator.js";
import customerService from "../services/customer.service.js";
const router = express.Router();

router.get(
  "/",
  authMiddleware,
  policyMiddleware(customerPolicy, "canViewAll"),
  customerController.index
);
router.get(
  "/:id",
  authMiddleware,
  validate(customerIdScheme, "params"),
  policyMiddleware(customerPolicy, "canView"),
  customerController.show
);
router.post(
  "/",
  authMiddleware,
  validate(createCustomerScheme),
  policyMiddleware(customerPolicy, "canCreate"),
  customerController.create
);
router.patch(
  "/:id",
  authMiddleware,
  validate(customerIdScheme, "params"),
  validate(updateCustomerScheme),
  policyMiddleware(customerPolicy, "canUpdate", {
    needModel: true,
    serviceMethod: customerService.getCustomer,
  }),
  customerController.update
);
router.delete(
  "/:id",
  authMiddleware,
  validate(customerIdScheme, "params"),
  policyMiddleware(customerPolicy, "canDelete", {
    needModel: true,
    serviceMethod: customerService.getCustomer,
  }),
  customerController.destroy
);

export default router;
