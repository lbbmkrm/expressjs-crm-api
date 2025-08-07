import express from "express";
import leadController from "../controllers/lead.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import policyMiddleware from "../middlewares/policy.middleware.js";
import leadPolicy from "../policies/lead.policy.js";
import opportunityPolicy from "../policies/opportunity.policy.js";
import activityPolicy from "../policies/activity.policy.js";
import notePolicy from "../policies/note.policy.js";
import validate from "../middlewares/validate.middleware.js";
import {
  createLeadScheme,
  leadStatusScheme,
  updateLeadScheme,
  leadIdScheme,
} from "../validators/lead.validator.js";
import leadService from "../services/lead.service.js";
const router = express.Router();

router.get(
  "/",
  authMiddleware,
  policyMiddleware(leadPolicy, "canViewAll"),
  validate(leadStatusScheme, "query"),
  leadController.index
);
router.get(
  "/:id",
  authMiddleware,
  validate(leadIdScheme, "params"),
  policyMiddleware(leadPolicy, "canView"),
  leadController.show
);
router.post(
  "/",
  authMiddleware,
  validate(createLeadScheme),
  policyMiddleware(leadPolicy, "canCreate"),
  leadController.create
);
router.patch(
  "/:id",
  authMiddleware,
  validate(leadIdScheme, "params"),
  validate(updateLeadScheme),
  policyMiddleware(leadPolicy, "canUpdate", {
    needModel: true,
    serviceMethod: leadService.getLeadById,
  }),
  leadController.update
);
router.delete(
  "/:id",
  authMiddleware,
  validate(leadIdScheme, "params"),
  policyMiddleware(leadPolicy, "canDelete", {
    needModel: true,
    serviceMethod: leadService.getLeadById,
  }),
  leadController.destroy
);

router.post(
  "/:id/convert",
  authMiddleware,
  validate(leadIdScheme, "params"),
  policyMiddleware(leadPolicy, "canConvert", {
    needModel: true,
    serviceMethod: leadService.getLeadById,
  }),
  leadController.convertLead
);
router.get(
  "/:id/opportunities",
  authMiddleware,
  validate(leadIdScheme, "params"),
  policyMiddleware(opportunityPolicy, "canView"),
  leadController.showOpportunities
);
router.get(
  "/:id/activities",
  authMiddleware,
  validate(leadIdScheme, "params"),
  policyMiddleware(activityPolicy, "canViewAll"),
  leadController.showActivities
);

router.get(
  "/:id/notes",
  authMiddleware,
  validate(leadIdScheme, "params"),
  policyMiddleware(notePolicy, "canViewAll"),
  leadController.showNotes
);
export default router;
