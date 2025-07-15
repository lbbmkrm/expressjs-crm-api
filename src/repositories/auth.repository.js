import prisma from "./prismaClient.js";

const authRepository = {
  findUserByUsername: async (username) => {
    return prisma.user.findUnique({
      where: {
        username: username,
      },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true,
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
