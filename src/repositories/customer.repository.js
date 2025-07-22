import prisma from "./prismaClient.js";

const customerRepository = {
  create: async (data) => {
    return prisma.customer.create({
      data: data,
      include: {
        user: {
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
      where: { id: id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
  },
  findByEmail: async (email) => {
    return prisma.customer.findUnique({
      where: { email },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
  },
  all: async () => {
    return prisma.customer.findMany({
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
      where: { id: id },
      data: data,
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
  },
  delete: async (id) => {
    return prisma.customer.delete({
      where: { id },
    });
  },
};

export default customerRepository;
