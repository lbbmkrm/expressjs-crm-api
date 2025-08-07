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
    return prisma.contact.findFirst({
      where: {
        email: email,
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
  findByCustomerId: async (customerId) => {
    return prisma.contact.findMany({
      where: {
        customerId: customerId,
        deletedAt: null,
      },
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
      where: {
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
  update: async (id, data) => {
    return prisma.contact.update({
      where: {
        id: id,
        deletedAt: null,
      },
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
    return prisma.contact.update({
      where: {
        id: id,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  },
};

export default contactRepository;
