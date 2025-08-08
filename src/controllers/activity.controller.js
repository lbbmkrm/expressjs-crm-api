import activityService from "../services/activity.service.js";

const activityController = {
  index: async (req, res, next) => {
    try {
      const { type } = req.query;
      const activities = await activityService.getAllActivities(type);
      const message =
        activities.length === 0
          ? "No activities found"
          : "Activities retrieved successfully";
      res.status(200).json({
        status: "success",
        message: message,
        data: activities,
      });
    } catch (err) {
      next(err);
    }
  },
  indexByUser: async (req, res, next) => {
    try {
      console.log("user", req.user);
      const activities = await activityService.getByUserId(req.user.id);
      const message =
        activities.length === 0
          ? "No activities found for this user"
          : "Activities retrieved successfully";
      res.status(200).json({
        status: "success",
        message: message,
        data: activities,
      });
    } catch (err) {
      next(err);
    }
  },
  show: async (req, res, next) => {
    try {
      const activity = await activityService.getActivity(
        parseInt(req.params.id)
      );
      res.status(200).json({
        status: "success",
        message: "Activity retrieved successfully",
        data: activity,
      });
    } catch (err) {
      next(err);
    }
  },
  create: async (req, res, next) => {
    try {
      const activity = await activityService.createActivity(
        req.user.id,
        req.body
      );
      res.status(201).json({
        status: "success",
        message: "Activity created successfully",
        data: activity,
      });
    } catch (err) {
      next(err);
    }
  },
  update: async (req, res, next) => {
    try {
      const activity = await activityService.updateActivity(
        parseInt(req.params.id),
        req.body
      );
      res.status(200).json({
        status: "success",
        message: "Activity updated successfully",
        data: activity,
      });
    } catch (err) {
      next(err);
    }
  },
  destroy: async (req, res, next) => {
    try {
      await activityService.deleteActivity(parseInt(req.params.id));
      res.status(200).json({
        status: "success",
        message: "Activity deleted successfully",
      });
    } catch (err) {
      next(err);
    }
  },
};

export default activityController;
