import express from "express";
import dashboardController from "../controllers/dashboard.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import updateDashboardScheme from "../validators/dashboard.validator.js";

const router = express.Router();

router.get("/", authMiddleware, dashboardController.show);
router.patch(
  "/",
  authMiddleware,
  validate(updateDashboardScheme),
  dashboardController.update
);

export default router;
