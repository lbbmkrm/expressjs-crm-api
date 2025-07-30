import { AppError } from "../utils/AppError.js";

const validate =
  (schema, property = "body") =>
  async (req, res, next) => {
    try {
      await schema.validateAsync(req[property]);
      next();
    } catch (err) {
      next(new AppError(err.message, 400));
    }
  };

export default validate;
