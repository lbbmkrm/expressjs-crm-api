import express from "express";
import leadController from "../controllers/lead.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";
import {
  createLeadScheme,
  leadStatusScheme,
  updateLeadScheme,
} from "../validators/lead.validator.js";

const router = express.Router();

router.get("/", authMiddleware, leadController.index);
router.get(
  "/status/:status",
  authMiddleware,
  validate(leadStatusScheme, "params"),
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
router.delete("/:id", authMiddleware, leadController.destroy);

export default router;
