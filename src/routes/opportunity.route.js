import express from "express";
import opportunityController from "./../controllers/opportunity.controller.js";
import authMiddleware from "./../middlewares/auth.middleware.js";
import policyMiddleware from "./../middlewares/policy.middleware.js";
import opportunityPolicy from "./../policies/opportunity.policy.js";
import validate from "./../middlewares/validate.middleware.js";
import {
  createOpportunityScheme,
  updateOpportunityScheme,
  opportunityIdScheme,
} from "./../validators/opportunity.validator.js";
import opportunityService from "../services/opportunity.service.js";
const router = express.Router();

router.get(
  "/",
  authMiddleware,
  policyMiddleware(opportunityPolicy, "canViewAll"),
  opportunityController.index
);
router.get(
  "/:id",
  authMiddleware,
  validate(opportunityIdScheme, "params"),
  policyMiddleware(opportunityPolicy, "canView"),
  opportunityController.show
);
router.post(
  "/",
  authMiddleware,
  validate(createOpportunityScheme),
  policyMiddleware(opportunityPolicy, "canCreate"),
  opportunityController.create
);
router.patch(
  "/:id",
  authMiddleware,
  validate(opportunityIdScheme, "params"),
  validate(updateOpportunityScheme),
  policyMiddleware(opportunityPolicy, "canUpdate", {
    needModel: true,
    serviceMethod: opportunityService.getOpportunityById,
  }),
  opportunityController.update
);
router.delete(
  "/:id",
  authMiddleware,
  validate(opportunityIdScheme, "params"),
  policyMiddleware(opportunityPolicy, "canDelete", {
    needModel: true,
    serviceMethod: opportunityService.getOpportunityById,
  }),
  opportunityController.destroy
);

export default router;
