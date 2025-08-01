import express from "express";
import activityController from "./../controllers/activity.controller.js";
import authMiddleware from "./../middlewares/auth.middleware.js";
import policyMiddleware from "./../middlewares/policy.middleware.js";
import activityPolicy from "./../policies/activity.policy.js";
import validate from "./../middlewares/validate.middleware.js";
import {
  createActivityScheme,
  updateActivityScheme,
  activityIdScheme,
  relationQueryScheme,
} from "./../validators/activity.validator.js";
import activityService from "../services/activity.service.js";
const router = express.Router();

router.get(
  "/",
  authMiddleware,
  validate(relationQueryScheme, "query"),
  policyMiddleware(activityPolicy, "canViewAll"),
  activityController.index
);
router.get("/myActivities", authMiddleware, activityController.indexByUser);
router.get(
  "/:id",
  authMiddleware,
  validate(activityIdScheme, "params"),
  policyMiddleware(activityPolicy, "canView", {
    needModel: true,
    serviceMethod: activityService.getActivityById,
  }),
  activityController.show
);
router.post(
  "/",
  authMiddleware,
  validate(createActivityScheme),
  policyMiddleware(activityPolicy, "canCreate"),
  activityController.create
);
router.patch(
  "/:id",
  authMiddleware,
  validate(activityIdScheme, "params"),
  validate(updateActivityScheme),
  policyMiddleware(activityPolicy, "canUpdate", {
    needModel: true,
    serviceMethod: activityService.getActivityById,
  }),
  activityController.update
);
router.delete(
  "/:id",
  authMiddleware,
  validate(activityIdScheme, "params"),
  policyMiddleware(activityPolicy, "canDelete", {
    needModel: true,
    serviceMethod: activityService.getActivityById,
  }),
  activityController.destroy
);

export default router;
