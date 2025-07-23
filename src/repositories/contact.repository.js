import prisma from "./prismaClient.js";

const contactRepository = {
  create: async (data) => {
    return prisma.contact.create({
      data,
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
    return prisma.contact.findUnique({
      where: { id },
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
    return prisma.contact.findUnique({
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
    return prisma.contact.findMany({
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
  update: async (id, data) => {
    return prisma.contact.update({
      where: { id },
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
    return prisma.contact.delete({
      where: { id },
    });
  },
};

export default contactRepository;
