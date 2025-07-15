import express from "express";
import customerController from "../controllers/customer.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";
import validate from "../middleware/validateMiddleware.js";
import {
  createCustomerScheme,
  updateCustomerScheme,
} from "../validators/customer.validator.js";

const router = express.Router();

router.get("/", authMiddleware, customerController.getAllCustomers);
router.get("/:id", authMiddleware, customerController.getCustomer);
router.post(
  "/",
  authMiddleware,
  validate(createCustomerScheme),
  customerController.createCustomer
);
router.patch(
  "/:id",
  authMiddleware,
  validate(updateCustomerScheme),
  customerController.updateCustomer
);
router.delete("/:id", authMiddleware, customerController.deleteCustomer);

export default router;
