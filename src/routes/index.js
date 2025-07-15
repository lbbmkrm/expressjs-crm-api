import express from "express";
import authRoute from "./auth.route.js";
import customerRoute from "./customer.route.js";

const router = express.Router();

router.use("/auth", authRoute);
router.use("/customers", customerRoute);

export default router;
