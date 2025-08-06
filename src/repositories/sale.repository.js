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
        creator: {
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
        creator: {
          select: {
            id: true,
            username: true,
          },
        },
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
  findByOpportunityId: async (opportunityId) => {
    return prisma.sale.findMany({
      where: {
        opportunityId: opportunityId,
      },
    });
  },
  findByCustomerId: async (customerId) => {
    return prisma.sale.findMany({
      where: {
        customerId: customerId,
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
  calculateTotalItemsSold: async () => {
    return prisma.saleItem.aggregate({
      _sum: {
        quantity: true,
      },
    });
  },
  calculateTotalItemsSoldByUserId: async (userId) => {
    return prisma.saleItem.aggregate({
      _sum: {
        quantity: true,
      },
      where: {
        sale: {
          createdByUserId: userId,
        },
      },
    });
  },
  calculateTotalSaleByUserId: async (userId) => {
    return prisma.sale.aggregate({
      _sum: {
        totalAmount: true,
      },
      where: {
        createdByUserId: userId,
        status: "COMPLETED",
      },
    });
  },
  calculateTotalRevenue: async () => {
    return prisma.sale.aggregate({
      _sum: {
        totalAmount: true,
      },
      where: {
        status: "COMPLETED",
      },
    });
  },
};

export default saleRepository;
