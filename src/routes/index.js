import express from "express";
import authRoute from "./auth.route.js";
import customerRoute from "./customer.route.js";
import contactRoute from "./contact.route.js";
import leadRoute from "./lead.route.js";
import opportunityRoute from "./opportunity.route.js";
import taskRoute from "./task.route.js";
import noteRoute from "./note.route.js";
import userRoute from "./user.route.js";
import activityRoute from "./activity.route.js";

const router = express.Router();

router.use("/auth", authRoute);
router.use("/customers", customerRoute);
router.use("/contacts", contactRoute);
router.use("/leads", leadRoute);
router.use("/opportunities", opportunityRoute);
router.use("/tasks", taskRoute);
router.use("/notes", noteRoute);
router.use("/users", userRoute);
router.use("/activities", activityRoute);

export default router;
