import { AppError } from "../utils/AppError.js";

const validate = (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body);
    next();
  } catch (err) {
    next(new AppError(err.message, 400));
  }
};

export default validate;
