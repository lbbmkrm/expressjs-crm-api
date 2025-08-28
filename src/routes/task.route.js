import express from "express";
import taskController from "../controllers/task.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import policyMiddleware from "../middlewares/policy.middleware.js";
import taskPolicy from "../policies/task.policy.js";
import validate from "../middlewares/validate.middleware.js";
import {
  createTaskScheme,
  updateTaskScheme,
  taskIdScheme,
  taskQueryScheme,
} from "../validators/task.validator.js";
import taskService from "../services/task.service.js";

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  validate(taskQueryScheme, "query"),
  policyMiddleware(taskPolicy, "canViewAll"),
  taskController.index
);
router.get("/my-tasks", authMiddleware, taskController.indexByUserTasks);
router.post(
  "/",
  authMiddleware,
  validate(createTaskScheme),
  policyMiddleware(taskPolicy, "canCreate"),
  taskController.create
);

router.patch(
  "/:id",
  authMiddleware,
  validate(taskIdScheme, "params"),
  validate(updateTaskScheme),
  policyMiddleware(taskPolicy, "canUpdate"),
  taskController.update
);

router.delete(
  "/:id",
  authMiddleware,
  validate(taskIdScheme, "params"),
  policyMiddleware(taskPolicy, "canDelete"),
  taskController.destroy
);

router.get(
  "/:id",
  authMiddleware,
  validate(taskIdScheme, "params"),
  policyMiddleware(taskPolicy, "canView", {
    needModel: true,
    serviceMethod: taskService.getTaskById,
  }),
  taskController.show
);

export default router;
