import dashboardService from "../services/dashboard.service.js";

const dashboardController = {
  show: async (req, res, next) => {
    try {
      const dashboard = await dashboardService.getDashboard(req.user);
      res.status(200).json({
        status: "success",
        message: "Dashboard retrieved successfully",
        data: dashboard,
      });
    } catch (err) {
      next(err);
    }
  },
  update: async (req, res, next) => {
    try {
      const dashboard = await dashboardService.updateDashboard(
        req.user.id,
        req.body
      );
      res.status(200).json({
        status: "success",
        message: "Dashboard updated successfully",
        data: dashboard,
      });
    } catch (err) {
      next(err);
    }
  },
};

export default dashboardController;
