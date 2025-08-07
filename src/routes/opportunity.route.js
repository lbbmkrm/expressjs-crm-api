import express from "express";
import opportunityController from "./../controllers/opportunity.controller.js";
import authMiddleware from "./../middlewares/auth.middleware.js";
import policyMiddleware from "./../middlewares/policy.middleware.js";
import opportunityPolicy from "./../policies/opportunity.policy.js";
import salePolicy from "../policies/sale.policy.js";
import activityPolicy from "../policies/activity.policy.js";
import notePolicy from "../policies/note.policy.js";
import validate from "./../middlewares/validate.middleware.js";
import {
  createOpportunityScheme,
  updateOpportunityScheme,
  opportunityIdScheme,
  opportunityStageScheme,
} from "./../validators/opportunity.validator.js";
import opportunityService from "../services/opportunity.service.js";
const router = express.Router();

router.get(
  "/",
  authMiddleware,
  validate(opportunityStageScheme, "query"),
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
router.get(
  "/:id/sales",
  authMiddleware,
  validate(opportunityIdScheme, "params"),
  policyMiddleware(salePolicy, "canViewAll"),
  opportunityController.showSales
);
router.get(
  "/:id/activities",
  authMiddleware,
  validate(opportunityIdScheme, "params"),
  policyMiddleware(activityPolicy, "canViewAll"),
  opportunityController.showActivities
);
router.get(
  "/:id/notes",
  authMiddleware,
  validate(opportunityIdScheme, "params"),
  policyMiddleware(notePolicy, "canViewAll"),
  opportunityController.showNotes
);
export default router;
