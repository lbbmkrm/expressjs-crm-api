import logger from "../config/logger.js";

const requestLogger = (req, res, next) => {
  logger.info("Incoming request", {
    method: req.method,
    url: req.originalUrl,
    timestamp: new Date().toISOString(),
    params: req.params,
    query: req.query,
  });
  next();
};

export default requestLogger;
