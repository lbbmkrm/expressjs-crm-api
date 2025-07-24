import express from "express";
import customerController from "../controllers/customer.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";
import validate from "../middleware/validateMiddleware.js";
import {
  createCustomerScheme,
  updateCustomerScheme,
} from "../validators/customer.validator.js";

const router = express.Router();

router.get("/", authMiddleware, customerController.index);
router.get("/:id", authMiddleware, customerController.show);
router.post(
  "/",
  authMiddleware,
  validate(createCustomerScheme),
  customerController.create
);
router.patch(
  "/:id",
  authMiddleware,
  validate(updateCustomerScheme),
  customerController.update
);
router.delete("/:id", authMiddleware, customerController.destroy);

export default router;
