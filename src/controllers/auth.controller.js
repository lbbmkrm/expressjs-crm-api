import authService from "../services/auth.service.js";

const authController = {
  register: async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      const result = await authService.register(username, email, password);
      res.status(201).json({
        status: "success",
        message: "User created successfully",
        data: result.user,
        token: result.token,
      });
    } catch (err) {
      next(err);
    }
  },

  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.status(200).json({
        status: "success",
        message: "Success login",
        data: result.user,
        token: result.token,
      });
    } catch (err) {
      next(err);
    }
  },
};

export default authController;
