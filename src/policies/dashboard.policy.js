import { AppError } from "../utils/AppError.js";

const dashboardPolicy = {
  canAccess: async (user, model) => {
    if (user.id === model.userId) {
      return true;
    }
    throw new AppError("Unauthorized", 403);
  },
};
export default dashboardPolicy;
