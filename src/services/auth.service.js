import authRepository from "../repositories/auth.repository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/index.js";

const authService = {
  register: async (username, email, password) => {
    const usernameExists = await authRepository.findUserByUsername(username);
    if (usernameExists) {
      throw new Error("Username already exists", 400);
    }
    const emailExists = await authRepository.findUserByEmail(email);
    if (emailExists) {
      throw new Error("Email already exists", 400);
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const token = jwt.sign({ username: username }, config.secret, {
      expiresIn: "1d",
    });

    const user = await authRepository.createUser({
      username: username,
      email: email,
      password: hashPassword,
    });

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      token: token,
    };
  },
  login: async (email, password) => {
    const user = await authRepository.findUserByEmail(email);
    const userPassword = await bcrypt.compare(password, user.password);

    if (!user || !userPassword) {
      throw new Error("Invalid email or password", 400);
    }

    const token = jwt.sign({ username: user.username }, config.secret, {
      expiresIn: "1d",
    });

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      token: token,
    };
  },
};

export default authService;
