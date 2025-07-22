import { AppError } from "../utils/AppError.js";
import logger from "../config/logger.js";
import config from "../config/index.js";

console.log(config.nodeEnv);
const globalErrorHandler = (err, req, res, next) => {
  logger.error(`Error: ${err.statusCode || 500} - ${err.message}`, err);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong!";

  if (err instanceof AppError && err.isOperational) {
    statusCode = err.statusCode;
    message = err.message;
  } else {
    if (config.nodeEnv === "production") {
      statusCode = 500;
      message = "Something went wrong on the server!";
    }
  }

  if (err.name === "PrismaClientKnownRequestError") {
    if (err.code === "P2002") {
      statusCode = 409;
      message = "Duplicate entry. This record already exists.";
    } else {
      statusCode = 500;
      message =
        config.nodeEnv === "production"
          ? "Database operation failed."
          : err.message;
    }
  }

  const response = {
    status: "error",
    message: message,
  };

  if (config.nodeEnv === "development") {
    response.error = err.message;
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

export default globalErrorHandler;
