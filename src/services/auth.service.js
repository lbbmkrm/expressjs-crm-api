import authRepository from "../repositories/auth.repository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/index.js";

const authService = {
  register: async (username, email, password) => {
    const usernameExists = await authRepository.findUserByUsername(username);
    if (usernameExists) {
      const err = new Error("Username already exists");
      err.statusCode = 400;
      throw err;
    }

    const emailExists = await authRepository.findUserByEmail(email);
    if (emailExists) {
      const err = new Error("Email already exists");
      err.statusCode = 400;
      throw err;
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await authRepository.createUser({
      username: username,
      email: email,
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
      token: token,
    };
  },

  login: async (email, password) => {
    const user = await authRepository.findUserByEmail(email);

    if (!user) {
      const err = new Error("Invalid email or password");
      err.statusCode = 400;
      throw err;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      const err = new Error("Invalid email or password");
      err.statusCode = 400;
      throw err;
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
      token: token,
    };
  },
};

export default authService;
