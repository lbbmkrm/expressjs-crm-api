import authService from "../services/auth.service.js";

const authController = {
  register: async (req, res) => {
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
      res.status(err.statusCode || 500).json({
        message: err.message,
        trace: err.stack,
      });
    }
  },

  login: async (req, res) => {
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
      res.status(err.statusCode || 500).json({
        message: err.message,
      });
    }
  },
};

export default authController;
