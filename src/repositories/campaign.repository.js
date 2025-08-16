import prisma from "./prismaClient.js";

const campaignRepository = {
  all: async (query) => {
    const whereClause = {
      deletedAt: null,
    };
    if (query.status) {
      whereClause.status = query.status;
    }
    if (query.type) {
      whereClause.type = query.type;
    }
    return prisma.campaign.findMany({
      where: whereClause,
    });
  },
  findById: async (id) => {
    return prisma.campaign.findUnique({
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
        lead: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  },
  create: async (data) => {
    return prisma.campaign.create({
      data: data,
      include: {
        creator: {
          select: {
            id: true,
            username: true,
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
  update: async (id, data) => {
    return prisma.campaign.update({
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
        lead: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  },
  softDelete: async (id) => {
    return prisma.campaign.update({
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

export default campaignRepository;
