import express from "express";
import router from "./routes/index.js";
import globalErrorHandler from "./middlewares/error.middleware.js";
import { AppError } from "./utils/AppError.js";
import requestLogger from "./middlewares/request.middleware.js";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";

const swaggerFile = JSON.parse(
  fs.readFileSync(path.resolve(process.cwd(), "openapi.json"), "utf8")
);
const app = express();
app.use(express.json());
app.use(requestLogger);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use("/api", router);
app.use((req, res, next) => {
  next(new AppError("Route not found", 404));
});

app.use(globalErrorHandler);
export default app;
