import prisma from "./prismaClient.js";

const customerRepository = {
  create: async (data) => {
    return prisma.customer.create({
      data: data,
      include: {
        creator: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
  },
  findById: async (id) => {
    return prisma.customer.findUnique({
      where: {
        id: id,
        deletedAt: null,
      },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
  },
  findByEmail: async (email) => {
    return prisma.customer.findFirst({
      where: { email: email, deletedAt: null },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
  },
  findByUserId: async (userId) => {
    return prisma.customer.findMany({
      where: {
        createdByUserId: userId,
        deletedAt: null,
      },
    });
  },
  all: async () => {
    return prisma.customer.findMany({
      where: {
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        company: true,
        createdAt: true,
        updatedAt: true,
        createdByUserId: true,
      },
    });
  },
  update: async (id, data) => {
    return prisma.customer.update({
      where: { id: id, deletedAt: null },
      data: data,
      include: {
        creator: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
  },
  delete: async (id) => {
    return prisma.customer.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  },
  countCustomers: async () => {
    return prisma.customer.count({
      where: {
        deletedAt: null,
      },
    });
  },
};

export default customerRepository;
