import userRepository from "../repositories/user.repository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/index.js";
import { AppError } from "../utils/AppError.js";

const authService = {
  register: async (username, email, password) => {
    const usernameExists = await userRepository.findByUsername(username);
    if (usernameExists) {
      throw new AppError("Username already exists", 400);
    }

    const emailExists = await userRepository.findByEmail(email);
    if (emailExists) {
      throw new AppError("Email already exists", 400);
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await userRepository.create({
      username,
      email,
      password: hashPassword,
    });

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      config.secret,
      { expiresIn: "1d" }
    );

    return {
      user,
      token,
    };
  },

  login: async (emailOrUsername, password) => {
    let user = await userRepository.loginCheck(emailOrUsername);
    if (!user) {
      throw new AppError("Invalid credentials", 400);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError("Invalid credentials", 400);
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      config.secret,
      { expiresIn: "24h" }
    );
    user = {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    return {
      user,
      token,
    };
  },
};

export default authService;
