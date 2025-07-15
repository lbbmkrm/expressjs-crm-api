import jwt from "jsonwebtoken";
import config from "../config/index.js";

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
    return res
      .status(401)
      .json({ status: "error", message: "Invalid or expired token" });
  }
};

export default authMiddleware;
