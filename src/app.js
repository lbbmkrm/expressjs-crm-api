import express from "express";
import router from "./routes/index.js";
import globalErrorHandler from "./middleware/errorHandler.js";
import { AppError } from "./utils/AppError.js";
import requestLogger from "./middleware/requestLogger.js";
const app = express();
app.use(express.json());
app.use(requestLogger);
app.use("/api", router);
app.use((req, res, next) => {
  next(new AppError("Route not found", 404));
});

app.use(globalErrorHandler);
export default app;
