import prisma from "./prismaClient.js";
const activityRelation = {
  createdByUser: {
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
};
const activityRepository = {
  findByRelation: async (relation) => {
    return prisma.activity.findMany({
      where: relation,
      include: activityRelation,
      orderBy: {
        createdAt: "desc",
      },
    });
  },
  findById: async (id) => {
    return prisma.activity.findUnique({
      where: {
        id: id,
      },
      include: activityRelation,
    });
  },
  findByUserId: async (userId) => {
    return prisma.activity.findMany({
      where: {
        createdByUserId: userId,
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
      },
      data: data,
      include: activityRelation,
    });
  },
  delete: async (id) => {
    return prisma.activity.delete({
      where: {
        id: id,
      },
    });
  },
  recentActivities: async () => {
    return prisma.activity.findMany({
      include: activityRelation,
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });
  },
};

export default activityRepository;
