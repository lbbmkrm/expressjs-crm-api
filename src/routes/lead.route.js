import express from "express";
import leadController from "../controllers/lead.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";
import validateLeadStatus from "./../middleware/validateLeadStatus.js";
import validate from "../middleware/validateMiddleware.js";
import {
  createLeadScheme,
  updateLeadScheme,
} from "../validators/lead.validator.js";

const router = express.Router();

router.get("/", authMiddleware, leadController.index);
router.get(
  "/status/:status",
  authMiddleware,
  validateLeadStatus,
  leadController.indexByStatus
);
router.get("/:id", authMiddleware, leadController.show);
router.post(
  "/",
  authMiddleware,
  validate(createLeadScheme),
  leadController.create
);
router.patch(
  "/:id",
  authMiddleware,
  validate(updateLeadScheme),
  leadController.update
);
router.delete("/:id", authMiddleware, leadController.delete);

export default router;
