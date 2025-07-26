import express from "express";
import userController from "../controllers/user.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";
import validate from "../middleware/validateMiddleware.js";
import {
  createUserScheme,
  updateUserScheme,
  userIdScheme,
} from "../validators/user.validator.js";

const router = express.Router();
router.get("/", authMiddleware, userController.index);
router.get(
  "/:id",
  authMiddleware,
  validate(userIdScheme, "params"),
  userController.show
);
router.post(
  "/",
  authMiddleware,
  validate(createUserScheme),
  userController.create
);
router.patch(
  "/:id",
  authMiddleware,
  validate(userIdScheme, "params"),
  validate(updateUserScheme),
  userController.update
);
router.delete(
  "/:id",
  authMiddleware,
  validate(userIdScheme, "params"),
  userController.destroy
);

export default router;
