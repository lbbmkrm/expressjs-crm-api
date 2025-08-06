import prisma from "./prismaClient.js";

const contactRepository = {
  create: async (data) => {
    return prisma.contact.create({
      data,
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
    return prisma.contact.findUnique({
      where: { id },
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
    return prisma.contact.findFirst({
      where: { email },
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
  findByCustomerId: async (customerId) => {
    return prisma.contact.findMany({
      where: { customerId },
      include: {
        customer: {
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
        },
        creator: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
  },
  all: async () => {
    return prisma.contact.findMany({
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
  update: async (id, data) => {
    return prisma.contact.update({
      where: { id },
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
    return prisma.contact.delete({
      where: { id },
    });
  },
};

export default contactRepository;
