import prisma from "./prismaClient.js";

const authRepository = {
  findUserByUsername: async (username) => {
    return prisma.user.findUnique({
      where: {
        username: username,
      },
    });
  },
  findUserByEmail: async (email) => {
    return prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  },
  createUser: async (data) => {
    return prisma.user.create({
      data: data,
    });
  },
};

export default authRepository;
