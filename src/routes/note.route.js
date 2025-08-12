import express from "express";
import noteController from "./../controllers/note.controller.js";
import authMiddleware from "./../middlewares/auth.middleware.js";
import policyMiddleware from "./../middlewares/policy.middleware.js";
import notePolicy from "./../policies/note.policy.js";
import validate from "./../middlewares/validate.middleware.js";
import {
  createNoteScheme,
  updateNoteScheme,
  noteIdScheme,
} from "./../validators/note.validator.js";
import noteService from "../services/note.service.js";
const router = express.Router();

router.get(
  "/",
  authMiddleware,
  policyMiddleware(notePolicy, "canViewAll"),
  noteController.index
);
router.get("/my-notes", authMiddleware, noteController.indexByUser);
router.get(
  "/:id",
  authMiddleware,
  validate(noteIdScheme, "params"),
  policyMiddleware(notePolicy, "canView", {
    needModel: true,
    serviceMethod: noteService.getNote,
  }),
  noteController.show
);
router.post(
  "/",
  authMiddleware,
  validate(createNoteScheme),
  policyMiddleware(notePolicy, "canCreate"),
  noteController.create
);
router.patch(
  "/:id",
  authMiddleware,
  validate(noteIdScheme, "params"),
  validate(updateNoteScheme),
  policyMiddleware(notePolicy, "canUpdate", {
    needModel: true,
    serviceMethod: noteService.getNote,
  }),
  noteController.update
);
router.delete(
  "/:id",
  authMiddleware,
  validate(noteIdScheme, "params"),
  policyMiddleware(notePolicy, "canDelete", {
    needModel: true,
    serviceMethod: noteService.getNote,
  }),
  noteController.destroy
);

export default router;
