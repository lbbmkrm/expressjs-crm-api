import taskService from "../services/task.service.js";

const taskController = {
  index: async (req, res, next) => {
    try {
      const tasks = await taskService.getAllTasks();
      const message =
        tasks.length === 0 ? "No tasks found" : "Tasks retrieved successfully";
      res.status(200).json({
        status: "success",
        message: message,
        data: tasks,
      });
    } catch (err) {
      next(err);
    }
  },
  show: async (req, res, next) => {
    try {
      const task = await taskService.getTaskById(parseInt(req.params.id));
      res.status(200).json({
        status: "success",
        message: "Task retrieved successfully",
        data: task,
      });
    } catch (err) {
      next(err);
    }
  },
  indexByAssignedUser: async (req, res, next) => {
    try {
      if (!req.params.assignedUserId) {
        throw new Error("No user id provided");
      }
      const tasks = await taskService.getTasksByAssignedUserId(
        parseInt(req.params.assignedUserId)
      );
      const message =
        tasks.length === 0 ? "No tasks found" : "Tasks retrieved successfully";
      res.status(200).json({
        status: "success",
        message: message,
        data: tasks,
      });
    } catch (err) {
      next(err);
    }
  },
  indexByStatus: async (req, res, next) => {
    try {
      console.log(req.params.status);
      const tasks = await taskService.getTasksByStatus(req.params.status);
      const message =
        tasks.length === 0 ? "No tasks found" : "Tasks retrieved successfully";
      res.status(200).json({
        status: "success",
        message: message,
        data: tasks,
      });
    } catch (err) {
      next(err);
    }
  },
  indexByPriority: async (req, res, next) => {
    try {
      const tasks = await taskService.getTasksByPriority(req.params.priority);
      const message =
        tasks.length === 0 ? "No tasks found" : "Tasks retrieved successfully";
      res.status(200).json({
        status: "success",
        message: message,
        data: tasks,
      });
    } catch (err) {
      next(err);
    }
  },
  indexByUserTasks: async (req, res, next) => {
    try {
      const tasks = await taskService.getUserTasks(parseInt(req.user.id));
      const message =
        tasks.length === 0 ? "No tasks found" : "Tasks retrieved successfully";
      res.status(200).json({
        status: "success",
        message: message,
        data: tasks,
      });
    } catch (err) {
      next(err);
    }
  },
  create: async (req, res, next) => {
    try {
      const task = await taskService.createTask(req.user.id, req.body);
      res.status(201).json({
        status: "success",
        message: "Task created successfully",
        data: task,
      });
    } catch (err) {
      next(err);
    }
  },
  update: async (req, res, next) => {
    try {
      console.warn(`Task Id ${req.params.id}`);
      const task = await taskService.updateTask(
        parseInt(req.params.id),
        req.body
      );
      res.status(200).json({
        status: "success",
        message: "Task updated successfully",
        data: task,
      });
    } catch (err) {
      next(err);
    }
  },
  destroy: async (req, res, next) => {
    try {
      await taskService.deleteTask(parseInt(req.params.id));
      res.status(200).json({
        status: "success",
        message: "Task deleted successfully",
      });
    } catch (err) {
      next(err);
    }
  },
};

export default taskController;
