import express from "express";
import noteController from "./../controllers/note.controller.js";
import authMiddleware from "./../middleware/auth.middleware.js";
import validate from "./../middleware/validate.middleware.js";
import {
  createNoteScheme,
  updateNoteScheme,
  noteIdScheme,
} from "./../validators/note.validator.js";

const router = express.Router();

router.get("/", authMiddleware, noteController.index);
router.get(
  "/:id",
  authMiddleware,
  validate(noteIdScheme, "params"),
  noteController.show
);
router.post(
  "/",
  authMiddleware,
  validate(createNoteScheme),
  noteController.create
);
router.patch(
  "/:id",
  authMiddleware,
  validate(noteIdScheme, "params"),
  validate(updateNoteScheme),
  noteController.update
);
router.delete(
  "/:id",
  authMiddleware,
  validate(noteIdScheme, "params"),
  noteController.destroy
);

export default router;
