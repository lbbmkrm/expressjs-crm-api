import { AppError } from "../utils/AppError.js";

const ticketPolicy = {
  canViewAll: async (user) => {
    if (user.role === "ADMIN" || user.role === "MANAGER") {
      return true;
    }
    throw new AppError("Unauthorized", 403);
  },
  canView: async (user) => {
    if (user.role === "ADMIN" || user.role === "MANAGER") {
      return true;
    }
    throw new AppError("Unauthorized", 403);
  },
  canCreate: async (user) => {
    if (user.role === "ADMIN" || user.role === "MANAGER") {
      return true;
    }
    throw new AppError("Unauthorized", 403);
  },
  canUpdate: async (user) => {
    if (user.role === "ADMIN" || user.role === "MANAGER") {
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

export default ticketPolicy;
