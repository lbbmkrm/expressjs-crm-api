import { AppError } from "../utils/AppError.js";

const productPolicy = {
  canViewAll: async (user) => {
    return true;
  },
  canView: async (user) => {
    return true;
  },
  canCreate: async (user) => {
    if (user.role === "ADMIN") {
      return true;
    }
    throw new AppError("Unauthorized", 403);
  },
  canUpdate: async (user, model) => {
    if (user.role === "ADMIN") {
      return true;
    }
    throw new AppError("Unauthorized", 403);
  },
  canDelete: async (user, model) => {
    if (user.role === "ADMIN") {
      return true;
    }
    throw new AppError("Unauthorized", 403);
  },
};

export default productPolicy;
