import express from "express";
import contactController from "../controllers/contact.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import policyMiddleware from "../middlewares/policy.middleware.js";
import contactPolicy from "../policies/contact.policy.js";
import activityPolicy from "../policies/activity.policy.js";
import notePolicy from "../policies/note.policy.js";
import {
  createContactScheme,
  updateContactScheme,
  contactIdScheme,
} from "../validators/contact.validator.js";
import contactService from "../services/contact.service.js";

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  policyMiddleware(contactPolicy, "canViewAll"),
  contactController.index
);
router.get(
  "/:id",
  authMiddleware,
  validate(contactIdScheme, "params"),
  policyMiddleware(contactPolicy, "canView"),
  contactController.show
);
router.post(
  "/",
  authMiddleware,
  validate(createContactScheme),
  policyMiddleware(contactPolicy, "canCreate"),
  contactController.create
);
router.patch(
  "/:id",
  authMiddleware,
  validate(contactIdScheme, "params"),
  validate(updateContactScheme),
  policyMiddleware(contactPolicy, "canUpdate", {
    needModel: true,
    serviceMethod: contactService.getContact,
  }),
  contactController.update
);
router.delete(
  "/:id",
  authMiddleware,
  validate(contactIdScheme, "params"),
  policyMiddleware(contactPolicy, "canDelete", {
    needModel: true,
    serviceMethod: contactService.getContact,
  }),
  contactController.destroy
);
router.get(
  "/:id/activities",
  authMiddleware,
  validate(contactIdScheme, "params"),
  policyMiddleware(activityPolicy, "canViewAll"),
  contactController.showActivities
);
router.get(
  "/:id/notes",
  authMiddleware,
  validate(contactIdScheme, "params"),
  policyMiddleware(notePolicy, "canViewAll"),
  contactController.showNotes
);

export default router;
