import userService from "../services/user.service.js";

const userController = {
  index: async (req, res, next) => {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json({
        status: "success",
        message: "Users retrieved successfully",
        data: users,
      });
    } catch (err) {
      next(err);
    }
  },
  show: async (req, res, next) => {
    try {
      const user = await userService.getUser(parseInt(req.params.id));
      res.status(200).json({
        status: "success",
        message: "User retrieved successfully",
        data: user,
      });
    } catch (err) {
      next(err);
    }
  },
  create: async (req, res, next) => {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json({
        status: "success",
        message: "User created successfully",
        data: user,
      });
    } catch (err) {
      next(err);
    }
  },
  update: async (req, res, next) => {
    try {
      const user = await userService.updateUser(
        parseInt(req.user.id),
        parseInt(req.params.id),
        req.body
      );
      res.status(200).json({
        status: "success",
        message: "User updated successfully",
        data: user,
      });
    } catch (err) {
      next(err);
    }
  },
  destroy: async (req, res, next) => {
    try {
      await userService.deleteUser(parseInt(req.params.id), req.user.id);
      res.status(200).json({
        status: "success",
        message: "User deleted successfully",
      });
    } catch (err) {
      next(err);
    }
  },
  usersCustomers: async (req, res, next) => {
    try {
      const customers = await userService.getUsersCustomers(
        parseInt(req.params.id)
      );
      const message =
        customers.length === 0
          ? "No customers found"
          : "Customers retrieved successfully";
      res.status(200).json({
        status: "success",
        message: message,
        data: customers,
      });
    } catch (err) {
      next(err);
    }
  },
  userAssignedTasks: async (req, res, next) => {
    try {
      const tasks = await userService.getUserAssignedTasks(
        parseInt(req.params.id)
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
  userCreatedTasks: async (req, res, next) => {
    try {
      const tasks = await userService.getUserCreatedTasks(
        parseInt(req.params.id)
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
};
export default userController;
