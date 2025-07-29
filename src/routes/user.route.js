import express from "express";
import userController from "../controllers/user.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";
import policyMiddleware from "../middleware/policy.middleware.js";
import {
  createUserScheme,
  updateUserScheme,
  userIdScheme,
} from "../validators/user.validator.js";
import userPolicy from "../policies/user.policy.js";
import userService from "../services/user.service.js";
const router = express.Router();
router.get(
  "/",
  authMiddleware,
  policyMiddleware(userPolicy, "canViewAll"),
  userController.index
);
router.get(
  "/:id",
  authMiddleware,
  validate(userIdScheme, "params"),
  policyMiddleware(userPolicy, "canView", {
    needModel: true,
    serviceMethod: userService.getUser,
  }),
  userController.show
);
router.post(
  "/",
  authMiddleware,
  validate(createUserScheme),
  policyMiddleware(userPolicy, "canCreate"),
  userController.create
);
router.patch(
  "/:id",
  authMiddleware,
  validate(userIdScheme, "params"),
  validate(updateUserScheme),
  policyMiddleware(userPolicy, "canUpdate", {
    needModel: true,
    serviceMethod: userService.getUser,
  }),
  userController.update
);
router.delete(
  "/:id",
  authMiddleware,
  validate(userIdScheme, "params"),
  policyMiddleware(userPolicy, "canDelete"),
  userController.destroy
);

export default router;
