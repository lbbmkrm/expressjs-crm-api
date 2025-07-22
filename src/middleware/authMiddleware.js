import jwt from "jsonwebtoken";
import config from "../config/index.js";
import { AppError } from "../utils/AppError.js";

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ status: "error", message: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, config.secret);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return next(new AppError("Invalid token", 401));
    }
    if (err.name === "TokenExpiredError") {
      return next(new AppError("Token expired", 401));
    }
    return next(new AppError("Authentication error", 401));
  }
};

export default authMiddleware;
