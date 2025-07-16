import express from "express";
import contactController from "../controllers/contact.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";
import validate from "../middleware/validateMiddleware.js";
import {
  createContactScheme,
  updateContactScheme,
} from "../validators/contact.validator.js";

const router = express.Router();

router.get("/", authMiddleware, contactController.getAllContacts);
router.get("/:id", authMiddleware, contactController.getContact);
router.post(
  "/",
  authMiddleware,
  validate(createContactScheme),
  contactController.createContact
);
router.patch(
  "/:id",
  authMiddleware,
  validate(updateContactScheme),
  contactController.updateContact
);
router.delete("/:id", authMiddleware, contactController.deleteContact);

export default router;
