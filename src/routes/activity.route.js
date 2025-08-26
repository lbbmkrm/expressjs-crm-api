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
  activityTypeScheme,
} from "./../validators/activity.validator.js";
import { documentIdScheme } from "../validators/document.validator.js";
import activityService from "../services/activity.service.js";
const router = express.Router();

router.get(
  "/",
  authMiddleware,
  validate(activityTypeScheme, "query"),
  policyMiddleware(activityPolicy, "canViewAll"),
  activityController.index
);
router.get("/my-activities", authMiddleware, activityController.indexByUser);
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

router.get(
  "/:id/documents",
  authMiddleware,
  validate(activityIdScheme, "params"),
  policyMiddleware(activityPolicy, "canView", {
    needModel: true,
    serviceMethod: activityService.getActivityById,
  }),
  activityController.getDocumentsForActivity
);

router.post(
  "/:id/documents/:documentId",
  authMiddleware,
  validate(activityIdScheme, "params"),
  validate(documentIdScheme, "params"),
  policyMiddleware(activityPolicy, "canUpdate", {
    needModel: true,
    serviceMethod: activityService.getActivityById,
  }),
  activityController.addDocumentToActivity
);

router.delete(
  "/:id/documents/:documentId",
  authMiddleware,
  validate(activityIdScheme, "params"),
  validate(documentIdScheme, "params"),
  policyMiddleware(activityPolicy, "canUpdate", {
    needModel: true,
    serviceMethod: activityService.getActivityById,
  }),
  activityController.removeDocumentFromActivity
);

export default router;
