import prisma from "./prismaClient.js";

const opportunityRepository = {
  create: async (data) => {
    return prisma.opportunity.create({
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
        lead: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  },
  all: async (stage) => {
    const whereClause = {
      deletedAt: null,
    };
    if (stage) {
      whereClause.stage = stage;
    }
    return prisma.opportunity.findMany({
      where: whereClause,
    });
  },
  findById: async (id) => {
    return prisma.opportunity.findUnique({
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
        lead: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  },
  findAllByLeadId: async (leadId) => {
    return prisma.opportunity.findMany({
      where: {
        leadId: leadId,
        deletedAt: null,
      },
    });
  },
  findByLeadId: async (leadId) => {
    return prisma.opportunity.findUnique({
      where: {
        leadId: leadId,
        deletedAt: null,
      },
    });
  },
  findByCustomerId: async (customerId) => {
    return prisma.opportunity.findMany({
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
    return prisma.opportunity.update({
      where: {
        id: id,
        deletedAt: null,
      },
      data: data,
    });
  },
  delete: async (id) => {
    return prisma.opportunity.update({
      where: {
        id: id,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  },
  countOpenOpportunities: async () => {
    return prisma.opportunity.count({
      where: {
        deletedAt: null,
        NOT: {
          stage: {
            in: ["WON", "LOST"],
          },
        },
      },
    });
  },
  countOpenOpportunitiesByUserId: async (userId) => {
    return prisma.opportunity.count({
      where: {
        createdByUserId: userId,
        deletedAt: null,
        NOT: {
          stage: {
            in: ["WON", "LOST"],
          },
        },
      },
    });
  },
};

export default opportunityRepository;
