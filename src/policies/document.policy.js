import { AppError } from "../utils/AppError.js";

const documentPolicy = {
  canViewAll: async (user) => {
    return true;
  },

  canView: async (user) => {
    return true;
  },

  canCreate: async (user) => {
    if (
      user.role === "ADMIN" ||
      user.role === "SALES" ||
      user.role === "MANAGER"
    ) {
      return true;
    }
    throw new AppError("Unauthorized", 403);
  },

  canUpdate: async (user, document) => {
    if (
      user.role === "ADMIN" ||
      (user.role === "SALES" && user.id === document.createdByUserId) ||
      user.role === "MANAGER"
    ) {
      return true;
    }
    throw new AppError("Unauthorized", 403);
  },

  canDelete: async (user, document) => {
    if (
      user.role === "ADMIN" ||
      (user.role === "SALES" && user.id === document.createdByUserId)
    ) {
      return true;
    }
    throw new AppError("Unauthorized", 403);
  },
};

export default documentPolicy;
