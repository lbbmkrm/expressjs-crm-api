import { AppError } from "../utils/AppError.js";

const campaignPolicy = {
  canViewAll: async () => {
    return true;
  },
  canView: async () => {
    return true;
  },
  canCreate: async (user) => {
    if (
      user.role === "ADMIN" ||
      user.role === "MANAGER" ||
      user.role === "SALES"
    ) {
      return true;
    }
    throw new AppError("Unauthorized", 403);
  },
  canUpdate: async (user, model) => {
    if (user.role === "ADMIN" || user.id === model.createdByUserId) {
      return true;
    }
    throw new AppError("Unauthorized", 403);
  },
  canDelete: async (user) => {
    if (user.role === "ADMIN") {
      return true;
    }
    throw new AppError("Unauthorized", 403);
  },
};

export default campaignPolicy;
