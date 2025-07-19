import express from "express";
import leadController from "../controllers/lead.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";
import validate from "../middleware/validateMiddleware.js";
import {
  createLeadScheme,
  updateLeadScheme,
} from "../validators/lead.validator.js";

const route = express.Router();

route.get("/", authMiddleware, leadController.index);
route.get("/:id", authMiddleware, leadController.show);
route.post(
  "/",
  authMiddleware,
  validate(createLeadScheme),
  leadController.create
);
route.patch(
  "/:id",
  authMiddleware,
  validate(updateLeadScheme),
  leadController.update
);
route.delete("/:id", authMiddleware, leadController.delete);

export default route;
