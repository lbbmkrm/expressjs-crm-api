import userRepository from "./../repositories/user.repository.js";
import customerRepository from "../repositories/customer.repository.js";
import taskRepository from "../repositories/task.repository.js";
import { AppError } from "./../utils/AppError.js";
import bcrypt from "bcrypt";
import prisma from "../repositories/prismaClient.js";

const userService = {
  getAllUsers: async () => {
    return userRepository.allUserActive();
  },
  getUser: async (id) => {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return user;
  },
  getUsersCustomers: async (userId) => {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    const customers = await customerRepository.findByUserId(userId);
    return customers;
  },
  getUserAssignedTasks: async (userId) => {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return taskRepository.findByAssignedUserId(userId);
  },
  getTasksByCreatorId: async (creatorId) => {
    const user = await userRepository.findById(creatorId);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return taskRepository.findByCreatorId(creatorId);
  },
  createUser: async (requestData) => {
    const existingUsername = await userRepository.findByUsername(
      requestData.username
    );
    if (existingUsername) {
      throw new AppError("Username already exists", 400);
    }
    const existingEmail = await userRepository.findByEmail(requestData.email);
    if (existingEmail) {
      throw new AppError("Email already exists", 400);
    }
    const hashPassword = await bcrypt.hash(requestData.password, 10);
    requestData.password = hashPassword;
    return userRepository.create(requestData);
  },
  updateUser: async (id, requestData) => {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return userRepository.update(id, requestData);
  },
  deleteUser: async (id, userId) => {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    if (user.id === userId) {
      throw new AppError("You cannot delete yourself", 400);
    }
    return prisma.$transaction(async (tx) => {
      await tx.dashboard.update({
        where: {
          userId: id,
          deletedAt: null,
        },
        data: {
          deletedAt: new Date(),
        },
      });
      return tx.user.update({
        where: {
          id: id,
          deletedAt: null,
        },
        data: {
          deletedAt: new Date(),
        },
      });
    });
  },
};

export default userService;
