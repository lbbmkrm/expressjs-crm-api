import express from "express";
import taskController from "../controllers/task.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";
import validate from "../middleware/validateMiddleware.js";
import {
  createTaskScheme,
  updateTaskScheme,
  taskIdScheme,
  statusParamScheme,
  priorityParamScheme,
  assignedUserIdScheme,
} from "../validators/task.validator.js";
import { AppError } from "../utils/AppError.js";

const router = express.Router();

router.get("/", authMiddleware, taskController.index);

router.get(
  "/status/:status",
  authMiddleware,
  validate(statusParamScheme, "params"),
  taskController.indexByStatus
);
router.get("/status", (req, res, next) => {
  next(new AppError("Route parameters is required", 400));
});
router.get(
  "/priority/:priority",
  authMiddleware,
  validate(priorityParamScheme, "params"),
  taskController.indexByPriority
);
router.get("/priority", (req, res, next) => {
  next(new AppError("Route parameters is required", 400));
});
router.get(
  "/assigned/:assignedUserId",
  authMiddleware,
  validate(assignedUserIdScheme, "params"),
  taskController.indexByAssignedUser
);
router.get("/assigned", (req, res, next) => {
  next(new AppError("Route parameters is required", 400));
});

router.post(
  "/",
  authMiddleware,
  validate(createTaskScheme),
  taskController.create
);

router.patch(
  "/:id",
  authMiddleware,
  validate(taskIdScheme, "params"),
  validate(updateTaskScheme),
  taskController.update
);

router.delete(
  "/:id",
  authMiddleware,
  validate(taskIdScheme, "params"),
  taskController.destroy
);

router.get(
  "/:id",
  authMiddleware,
  validate(taskIdScheme, "params"),
  taskController.show
);

export default router;
