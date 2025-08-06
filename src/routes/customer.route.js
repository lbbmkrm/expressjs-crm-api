import express from "express";
import customerController from "../controllers/customer.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import policyMiddleware from "../middlewares/policy.middleware.js";
import customerPolicy from "../policies/customer.policy.js";
import contactPolicy from "../policies/contact.policy.js";
import leadPolicy from "../policies/lead.policy.js";
import validate from "../middlewares/validate.middleware.js";
import {
  createCustomerScheme,
  updateCustomerScheme,
  customerIdScheme,
} from "../validators/customer.validator.js";
import customerService from "../services/customer.service.js";
import opportunityPolicy from "../policies/opportunity.policy.js";
import salePolicy from "../policies/sale.policy.js";
import activityPolicy from "../policies/activity.policy.js";
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
router.get(
  "/:id/contacts",
  authMiddleware,
  validate(customerIdScheme, "params"),
  policyMiddleware(contactPolicy, "canView"),
  customerController.showContacts
);
router.get(
  "/:id/leads",
  authMiddleware,
  validate(customerIdScheme, "params"),
  policyMiddleware(leadPolicy, "canView"),
  customerController.showLeads
);
router.get(
  "/:id/opportunities",
  authMiddleware,
  validate(customerIdScheme, "params"),
  policyMiddleware(opportunityPolicy, "canView"),
  customerController.showOpportunities
);
router.get(
  "/:id/sales",
  authMiddleware,
  validate(customerIdScheme, "params"),
  policyMiddleware(salePolicy, "canView"),
  customerController.showSales
);
router.get(
  "/:id/activities",
  authMiddleware,
  validate(customerIdScheme, "params"),
  policyMiddleware(activityPolicy, "canViewByCustomer"),
  customerController.showCustomerActivities
);

export default router;
