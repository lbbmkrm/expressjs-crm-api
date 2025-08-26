import prisma from "./prismaClient.js";
const activityRelation = {
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
  contact: {
    select: {
      id: true,
      email: true,
    },
  },
  lead: {
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
  documents: true,
};
const activityRepository = {
  all: async (type) => {
    const whereClause = {
      deletedAt: null,
    };
    if (type) {
      whereClause.type = type;
    }
    return prisma.activity.findMany({
      where: whereClause,
      include: activityRelation,
    });
  },
  findById: async (id) => {
    return prisma.activity.findUnique({
      where: {
        id: id,
        deletedAt: null,
      },
      include: activityRelation,
    });
  },
  findByUserId: async (userId) => {
    return prisma.activity.findMany({
      where: {
        createdByUserId: userId,
        deletedAt: null,
      },
      include: activityRelation,
    });
  },
  findByCustomerId: async (customerId) => {
    return prisma.activity.findMany({
      where: {
        customerId: customerId,
        deletedAt: null,
      },
      include: activityRelation,
    });
  },
  findByLeadId: async (leadId) => {
    return prisma.activity.findMany({
      where: {
        leadId: leadId,
        deletedAt: null,
      },
      include: activityRelation,
    });
  },
  findByOpportunityId: async (opportunityId) => {
    return prisma.activity.findMany({
      where: {
        opportunityId: opportunityId,
        deletedAt: null,
      },
      include: activityRelation,
    });
  },
  findByContactId: async (contactId) => {
    return prisma.activity.findMany({
      where: {
        contactId: contactId,
        deletedAt: null,
      },
      include: activityRelation,
    });
  },
  create: async (data) => {
    return prisma.activity.create({
      data: data,
      include: activityRelation,
    });
  },
  update: async (id, data) => {
    return prisma.activity.update({
      where: {
        id: id,
        deletedAt: null,
      },
      data: data,
      include: activityRelation,
    });
  },
  delete: async (id) => {
    return prisma.activity.update({
      where: {
        id: id,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  },
  recentActivities: async () => {
    return prisma.activity.findMany({
      where: {
        deletedAt: null,
      },
      include: activityRelation,
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });
  },
};

export default activityRepository;
