import prisma from "./prismaClient.js";

const saleRepository = {
  all: async () => {
    return prisma.sale.findMany({
      where: {
        deletedAt: null,
      },
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
        deletedAt: null,
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
        deletedAt: null,
      },
    });
  },
  findByCustomerId: async (customerId) => {
    return prisma.sale.findMany({
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
          },
        },
      },
    });
  },
  findByOpportunityId: async (opportunityId) => {
    return prisma.sale.findMany({
      where: {
        opportunityId: opportunityId,
        deletedAt: null,
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
        deletedAt: null,
      },
      data: {
        status: data.status,
      },
      include: {
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
  calculateTotalItemsSold: async () => {
    return prisma.saleItem.aggregate({
      where: {
        deletedAt: null,
      },
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
        deletedAt: null,
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
        deletedAt: null,
      },
    });
  },
  calculateTotalRevenue: async () => {
    const result = await prisma.sale.aggregate({
      _sum: {
        totalAmount: true,
      },
      where: {
        status: "COMPLETED",
        deletedAt: null,
      },
    });
    return result._sum.totalAmount || 0;
  },
};

export default saleRepository;
