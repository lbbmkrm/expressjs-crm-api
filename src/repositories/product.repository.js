import prisma from "./prismaClient.js";

const productRepository = {
  all: async () => {
    return prisma.product.findMany({
      where: {
        isActive: true,
      },
    });
  },
  findById: async (id) => {
    return prisma.product.findUnique({
      where: {
        id: id,
        isActive: true,
      },
    });
  },
  create: async (data) => {
    return prisma.product.create({
      data: data,
    });
  },
  update: async (id, data) => {
    return prisma.product.update({
      where: {
        id: id,
        isActive: true,
      },
      data: data,
    });
  },
  delete: async (id) => {
    return prisma.product.update({
      where: {
        id: id,
        isActive: true,
      },
      data: {
        isActive: false,
      },
    });
  },
};

export default productRepository;
