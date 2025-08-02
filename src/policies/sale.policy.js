import { AppError } from "../utils/AppError.js";

const salePolicy = {
  canViewAll: async (user) => {
    return true;
  },
  canView: async (user) => {
    return true;
  },
  canCreate: async (user) => {
    if (user.role === "VIEWER") {
      throw new AppError("Unauthorized", 403);
    }
    return true;
  },
  canUpdate: async (user, model) => {
    if (user.role === "ADMIN" || user.id === model.createdByUserId) {
      return true;
    }
    throw new AppError("Unauthorized", 403);
  },
  canDelete: async (user) => {
    return false;
  },
};

export default salePolicy;
