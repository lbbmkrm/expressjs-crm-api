import userRepository from "./../repositories/user.repository.js";
import { AppError } from "./../utils/AppError.js";
import bcrypt from "bcrypt";

const userService = {
  getAllUsers: async () => {
    return userRepository.all();
  },
  getUser: async (id) => {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return user;
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
  deleteUser: async (id) => {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return userRepository.delete(id);
  },
};

export default userService;
