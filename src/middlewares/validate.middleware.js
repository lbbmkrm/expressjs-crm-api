import { AppError } from "../utils/AppError.js";
import fsPromises from "fs/promises";

const convertEmptyStringToNull = (obj) => {
  const result = {};

  for (const key in obj) {
    const value = obj[key];

    if (typeof value === "string" && value.trim() === "") {
      result[key] = null;
    } else {
      result[key] = value;
    }
  }
  return result;
};
const validate =
  (schema, property = "body") =>
  async (req, res, next) => {
    try {
      let dataToValidate;
      if (property === "body") {
        dataToValidate = {
          ...req.body,
        };
        dataToValidate = convertEmptyStringToNull(dataToValidate);
        if (req.file) {
          dataToValidate.file = req.file;
        }
      } else {
        dataToValidate = req[property];
      }
      await schema.validateAsync(dataToValidate);
      next();
    } catch (err) {
      if (req.file) {
        try {
          await fsPromises.unlink(req.file.path);
        } catch (err) {
          return next(err);
        }
      }
      return next(new AppError(err.message, 400));
    }
  };

export default validate;
