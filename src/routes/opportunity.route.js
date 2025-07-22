import express from "express";
import opportunityController from "./../controllers/opportunityController.js";
import authMiddleware from "./../middleware/authMiddleware.js";
import validate from "./../middleware/validateMiddleware.js";
import {
  createOpportunityScheme,
  updateOpportunityScheme,
} from "./../validators/opportunity.validator.js";

const router = express.Router();

router.get("/", authMiddleware, opportunityController.index);
router.get("/:id", authMiddleware, opportunityController.show);
router.post(
  "/",
  authMiddleware,
  validate(createOpportunityScheme),
  opportunityController.create
);
router.patch(
  "/:id",
  authMiddleware,
  validate(updateOpportunityScheme),
  opportunityController.update
);
router.delete("/:id", authMiddleware, opportunityController.delete);

export default router;
