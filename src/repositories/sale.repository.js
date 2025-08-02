import prisma from "./prismaClient.js";

const saleRepository = {
  all: async () => {
    return prisma.sale.findMany({
      include: {
        customer: {
          select: {
            id: true,
            name: true,
          },
        },
        createdByUser: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: {
        saleDate: "desc",
      },
    });
  },
  findById: async (id) => {
    return prisma.sale.findUnique({
      where: {
        id: id,
      },
      include: {
        customer: {
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
        items: {
          select: {
            product: {
              select: {
                id: true,
                name: true,
              },
            },
            unitPrice: true,
            quantity: true,
          },
        },
      },
    });
  },
  create: async (saleData, itemsData) => {
    return prisma.sale.create({
      data: {
        ...saleData,
        items: {
          create: itemsData,
        },
      },
      include: {
        customer: {
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
        items: {
          select: {
            product: {
              select: {
                id: true,
                name: true,
              },
            },
            unitPrice: true,
            quantity: true,
          },
        },
      },
    });
  },
  update: async (id, data) => {
    return prisma.sale.update({
      where: {
        id: id,
      },
      data: {
        status: data.status,
      },
    });
  },
};

export default saleRepository;
