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
      const user = await userService.updateUser(req.body.id, req.body);
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
};
export default userController;
