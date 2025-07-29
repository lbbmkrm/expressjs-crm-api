import { AppError } from "../utils/AppError.js";

const policyMiddleware = (policy, method, options = {}) => {
  return async (req, res, next) => {
    try {
      if (options.needModel) {
        const modelId = parseInt(req.params.id);
        const model = await options.serviceMethod(parseInt(modelId));
        await policy[method](req.user, model);
        req.model = model;
      } else {
        await policy[method](req.user);
      }
      next();
    } catch (err) {
      if (err instanceof AppError) {
        return next(err);
      }
      return next(new AppError("Unauthorized", 403));
    }
  };
};

export default policyMiddleware;
