import prisma from "./prismaClient.js";
const leadRepository = {
  create: async (data) => {
    return prisma.lead.create({
      data: data,
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
      },
    });
  },
  all: async (status) => {
    const whereClause = {
      deletedAt: null,
    };
    if (status) {
      whereClause.status = status;
    }
    return prisma.lead.findMany({
      where: whereClause,
    });
  },
  findById: async (id) => {
    const lead = await prisma.lead.findUnique({
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
      },
    });
    return lead;
  },
  findByCustomerId: async (customerId) => {
    return prisma.lead.findMany({
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
    const updatedLead = await prisma.lead.update({
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
        customer: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return updatedLead;
  },
  delete: async (id) => {
    return prisma.lead.update({
      where: {
        id: id,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  },
  countLeads: async () => {
    return prisma.lead.count({
      where: {
        deletedAt: null,
      },
    });
  },
  countNewsLeads: async () => {
    return prisma.lead.count({
      where: {
        status: "NEW",
        deletedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },
  countNewLeadsByUserId: async (userId) => {
    return prisma.lead.count({
      where: {
        createdByUserId: userId,
        status: "NEW",
        deletedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },
};

export default leadRepository;
