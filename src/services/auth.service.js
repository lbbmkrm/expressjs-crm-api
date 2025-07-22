import authRepository from "../repositories/auth.repository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/index.js";
import { AppError } from "../utils/AppError.js";

const authService = {
  register: async (username, email, password) => {
    const usernameExists = await authRepository.findByUsername(username);
    if (usernameExists) {
      throw new AppError("Username already exists", 400);
    }

    const emailExists = await authRepository.findByEmail(email);
    if (emailExists) {
      throw new AppError("Email already exists", 400);
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await authRepository.create({
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
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      token,
    };
  },

  login: async (email, password) => {
    const user = await authRepository.findByEmail(email);
    if (!user) {
      throw new AppError("Invalid email or password", 400);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError("Invalid email or password", 400);
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      config.secret,
      { expiresIn: "1h" }
    );

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      token,
    };
  },
};

export default authService;
