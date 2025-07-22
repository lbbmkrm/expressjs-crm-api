import express from "express";
import router from "./routes/index.js";
import globalErrorHandler from "./middleware/errorHandler.js";

const app = express();
app.use(express.json());
app.use("/api", router);
app.use((req, res, next) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

app.use(globalErrorHandler);
export default app;
