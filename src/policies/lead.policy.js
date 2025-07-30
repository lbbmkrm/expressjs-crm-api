import { AppError } from "../utils/AppError.js";

const leadPolicy = {
  canViewAll: async (user) => {
    return true;
  },
  canView: async (user) => {
    return true;
  },
  canCreate: async (user) => {
    if (user.role === "ADMIN" || user.role === "SALES") {
      return true;
    }
    throw new AppError("Unauthorized", 403);
  },
  canUpdate: async (user, model) => {
    if (
      user.role === "ADMIN" ||
      (user.role === "SALES" && user.id === model.createdByUserId) ||
      user.role === "MANAGER"
    ) {
      return true;
    }
    throw new AppError("Unauthorized", 403);
  },
  canDelete: async (user, model) => {
    if (
      user.role === "ADMIN" ||
      (user.role === "SALES" && user.id === model.createdByUserId)
    ) {
      return true;
    }
    throw new AppError("Unauthorized", 403);
  },
};

export default leadPolicy;
