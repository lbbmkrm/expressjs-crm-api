import logger from "./../config/logger.js";

const requestLogger = (req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl} - ${new Date().toISOString()}`);
  logger.info(`Params: ${JSON.stringify(req.params)}`);
  if (req.method !== "GET") {
    logger.info(`Body: ${JSON.stringify(req.body)}`);
  }
  next();
};

export default requestLogger;
