import { AppError } from "../utils/AppError.js";

const notePolicy = {
  canViewAll: async (user) => {
    if (user.role === "ADMIN" || user.role === "MANAGER") {
      return true;
    }
    throw new AppError("Unauthorized", 403);
  },
  canView: async (user, model) => {
    if (
      user.role === "ADMIN" ||
      user.role === "MANAGER" ||
      user.id === model.createdByUserId
    ) {
      return true;
    }
    throw new AppError("Unauthorized", 403);
  },
  canCreate: async (user) => {
    return true;
  },
  canUpdate: async (user, model) => {
    if (user.role === "ADMIN" || user.id === model.createdByUserId) {
      return true;
    }
    throw new AppError("Unauthorized", 403);
  },
  canDelete: async (user, model) => {
    if (user.role === "ADMIN" || user.id === model.createdByUserId) {
      return true;
    }
    throw new AppError("Unauthorized", 403);
  },
};

export default notePolicy;
