import logger from "./../config/logger.js";

const requestLogger = (req, res, next) => {
  logger.info(
    `${req.method} ${req.originalUrl} - ${req.ip} - ${new Date().toISOString()}`
  );
  next();
};

export default requestLogger;
