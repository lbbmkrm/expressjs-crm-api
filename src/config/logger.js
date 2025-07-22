import winston from "winston";
import "winston-daily-rotate-file";
import config from "./index.js";

const { combine, timestamp, printf, colorize, align } = winston.format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  if (stack) {
    return `${timestamp} ${level}: ${message}\n${stack}`;
  }
  return `${timestamp} ${level}: ${message}`;
});

const logger = winston.createLogger({
  level: config.nodeEnv === "development" ? "debug" : "info",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    align(),
    logFormat
  ),
  transports: [
    new winston.transports.Console({
      level: "debug",
      format: combine(colorize({ all: true }), logFormat),
      silent: config.nodeEnv === "production",
    }),
    new winston.transports.DailyRotateFile({
      filename: "application-error-%DATE%.log",
      level: "error",
      dirname: "logs/error",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "7d",
    }),
    new winston.transports.DailyRotateFile({
      filename: "application-%DATE%.log",
      level: "info",
      dirname: "logs",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "7d",
    }),
  ],
});

export default logger;
