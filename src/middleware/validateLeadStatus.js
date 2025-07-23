import { AppError } from "../utils/AppError.js";

const validateLeadStatus = (req, res, next) => {
  const validStatus = ["NEW", "CONTACTED", "WON", "LOST"];
  const status = req.params.status.toUpperCase();
  if (!validStatus.includes(status)) {
    return next(new AppError("Invalid status", 400));
  }
  req.params.status = status;
  next();
};

export default validateLeadStatus;
