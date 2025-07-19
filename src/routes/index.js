import express from "express";
import authRoute from "./auth.route.js";
import customerRoute from "./customer.route.js";
import contactRoute from "./contact.route.js";
import leadRoute from "./lead.route.js";
const router = express.Router();

router.use("/auth", authRoute);
router.use("/customers", customerRoute);
router.use("/contacts", contactRoute);
router.use("/leads", leadRoute);

export default router;
