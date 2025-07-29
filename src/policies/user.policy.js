import { AppError } from "../utils/AppError.js";

const userPolicy = {
  canViewAll: async (user) => {
    if (user.role === "ADMIN") {
      return true;
    }

    throw new AppError("Unauthorized", 403);
  },
  canView: async (user, model) => {
    if (user.role === "ADMIN" || user.id === model.id) {
      return true;
    }
    throw new AppError("Unauthorized", 403);
  },
  canCreate: async (user) => {
    if (user.role === "ADMIN") {
      return true;
    }
    throw new AppError("Unauthorized", 403);
  },
  canUpdate: async (user, model) => {
    if (user.role === "ADMIN" || user.id === model.id) {
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

export default userPolicy;
