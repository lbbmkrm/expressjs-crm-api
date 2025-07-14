import express from "express";
import authController from "./../controllers/auth.controller.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";
import validate from "../middleware/validateMiddleware.js";

const router = express.Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);

export default router;
