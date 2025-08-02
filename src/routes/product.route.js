import express from "express";
import productController from "../controllers/product.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import policyMiddleware from "../middlewares/policy.middleware.js";
import productPolicy from "../policies/product.policy.js";
import {
  createProductScheme,
  updateProductScheme,
  productIdScheme,
} from "../validators/product.validator.js";

const router = express.Router();
router.get(
  "/",
  authMiddleware,
  policyMiddleware(productPolicy, "canViewAll"),
  productController.index
);
router.get(
  "/:id",
  authMiddleware,
  validate(productIdScheme, "params"),
  policyMiddleware(productPolicy, "canView"),
  productController.show
);
router.post(
  "/",
  authMiddleware,
  validate(createProductScheme),
  policyMiddleware(productPolicy, "canCreate"),
  productController.create
);
router.patch(
  "/:id",
  authMiddleware,
  validate(productIdScheme, "params"),
  validate(updateProductScheme),
  policyMiddleware(productPolicy, "canUpdate"),
  productController.update
);
router.delete(
  "/:id",
  authMiddleware,
  validate(productIdScheme, "params"),
  policyMiddleware(productPolicy, "canDelete"),
  productController.destroy
);

export default router;
