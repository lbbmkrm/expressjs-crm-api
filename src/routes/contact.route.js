import express from "express";
import contactController from "../controllers/contact.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";
import validate from "../middleware/validateMiddleware.js";
import {
  createContactScheme,
  updateContactScheme,
} from "../validators/contact.validator.js";

const router = express.Router();

router.get("/", authMiddleware, contactController.index);
router.get("/:id", authMiddleware, contactController.show);
router.post(
  "/",
  authMiddleware,
  validate(createContactScheme),
  contactController.create
);
router.patch(
  "/:id",
  authMiddleware,
  validate(updateContactScheme),
  contactController.update
);
router.delete("/:id", authMiddleware, contactController.destroy);

export default router;
