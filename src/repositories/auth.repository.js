import prisma from "./prismaClient.js";

const authRepository = {
  findByUsername: async (username) => {
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
  findByEmail: async (email) => {
    return prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  },
  create: async (data) => {
    return prisma.user.create({
      data: data,
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },
};

export default authRepository;
