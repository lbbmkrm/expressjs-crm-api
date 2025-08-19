import prisma from "./prismaClient.js";

const dashboardRepository = {
  findByUserId: async (userId) => {
    return prisma.dashboard.findFirst({
      where: {
        userId: userId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });
  },
  create: async (data) => {
    return prisma.dashboard.create({
      data: data,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });
  },
  update: async (userId, data) => {
    return prisma.dashboard.update({
      where: {
        userId: userId,
      },
      data: data,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });
  },
  delete: async (userId) => {
    return prisma.dashboard.update({
      where: {
        userId: userId,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  },
};

export default dashboardRepository;
