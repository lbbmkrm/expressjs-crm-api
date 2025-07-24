import prisma from "./prismaClient.js";

const userRepository = {
  all: async () => {
    return prisma.user.findMany();
  },
  findById: async (id) => {
    return prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        customers: {
          select: {
            id: true,
            name: true,
          },
        },
        lead: {
          select: {
            id: true,
            name: true,
          },
        },
        opportunities: {
          select: {
            id: true,
            name: true,
          },
        },
        taskAssigned: {
          select: {
            id: true,
            name: true,
          },
        },
        taskCreator: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  },
  update: async (id, data) => {
    return prisma.user.update({
      where: {
        id: id,
      },
      data: data,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
          },
        },
        lead: {
          select: {
            id: true,
            name: true,
          },
        },
        opportunity: {
          select: {
            id: true,
            name: true,
          },
        },
        task: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  },
  delete: async (id) => {
    return prisma.user.delete({
      where: {
        id: id,
      },
    });
  },
};

export default userRepository;
