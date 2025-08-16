import express from "express";
import campaignController from "./../controllers/campaign.controller.js";
import authMiddleware from "./../middlewares/auth.middleware.js";
import validate from "./../middlewares/validate.middleware.js";
import {
  createCampaignScheme,
  updateCampaignScheme,
  campaignIdScheme,
  campaignQueryScheme,
} from "../validators/campaign.validator.js";
import policyMiddleware from "./../middlewares/policy.middleware.js";
import campaignPolicy from "./../policies/campaign.policy.js";
import campaignService from "../services/campaign.service.js";
import leadPolicy from "../policies/lead.policy.js";
const router = express.Router();
router.use(authMiddleware);

router.get(
  "/",
  validate(campaignQueryScheme, "query"),
  policyMiddleware(campaignPolicy, "canViewAll"),
  campaignController.index
);
router.get(
  "/:id",
  validate(campaignIdScheme, "params"),
  policyMiddleware(campaignPolicy, "canView"),
  campaignController.show
);

router.post(
  "/",
  validate(createCampaignScheme),
  policyMiddleware(campaignPolicy, "canCreate"),
  campaignController.create
);

router.patch(
  "/:id",
  validate(campaignIdScheme, "params"),
  validate(updateCampaignScheme),
  policyMiddleware(campaignPolicy, "canUpdate", {
    needModel: true,
    serviceMethod: campaignService.getCampaignById,
  }),
  campaignController.update
);

router.delete(
  "/:id",
  validate(campaignIdScheme, "params"),
  policyMiddleware(campaignPolicy, "canDelete"),
  campaignController.destroy
);

router.get(
  "/:id/leads",
  validate(campaignIdScheme, "params"),
  policyMiddleware(leadPolicy, "canViewAll"),
  campaignController.showLeads
);

export default router;
