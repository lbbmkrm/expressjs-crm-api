import prisma from "./prismaClient.js";

const documentRepository = {
  all: async (documentType) => {
    const whereClause = {
      deletedAt: null,
    };
    if (documentType) {
      whereClause.documentType = documentType;
    }
    return prisma.document.findMany({
      where: whereClause,
    });
  },
  findById: async (id) => {
    return prisma.document.findUnique({
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
  create: async (data) => {
    return prisma.document.create({
      data: {
        ...data,
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
    return prisma.document.update({
      where: {
        id: id,
        deletedAt: null,
      },
      data: data,
    });
  },
  softDelete: async (id) => {
    return prisma.document.update({
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

export default documentRepository;
