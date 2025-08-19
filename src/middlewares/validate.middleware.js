import { AppError } from "../utils/AppError.js";

const validate =
  (schema, property = "body") =>
  async (req, res, next) => {
    try {
      let dataToValidate;
      if (property === "body" && req.file) {
        dataToValidate = {
          ...req.body,
          file: req.file,
        };
      } else {
        dataToValidate = req[property];
      }
      await schema.validateAsync(dataToValidate);
      next();
    } catch (err) {
      next(new AppError(err.message, 400));
    }
  };

export default validate;
