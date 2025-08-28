import prisma from "./prismaClient.js";

const taskRelation = {
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
  opportunity: {
    select: {
      id: true,
      name: true,
    },
  },
  assignedToUser: {
    select: {
      id: true,
      username: true,
    },
  },
};

const taskRepository = {
  create: async (data) => {
    return prisma.task.create({
      data: data,
      include: taskRelation,
    });
  },
  all: async (query) => {
    const { status, priority, assignedUserId } = query;
    const whereClause = {
      deletedAt: null,
    };
    if (status) {
      whereClause.status = status;
    }
    if (priority) {
      whereClause.priority = priority;
    }
    if (assignedUserId) {
      whereClause.assignedToUserId = assignedUserId;
    }
    return prisma.task.findMany({
      where: whereClause,
      include: taskRelation,
    });
  },
  findById: async (id) => {
    return prisma.task.findUnique({
      where: {
        id: id,
        deletedAt: null,
      },
      include: taskRelation,
    });
  },
  findByAssignedUserId: async (assignedUserId) => {
    return prisma.task.findMany({
      where: {
        assignedToUserId: assignedUserId,
        deletedAt: null,
      },
      include: taskRelation,
    });
  },
  findByCreatorId: async (creatorId) => {
    return prisma.task.findMany({
      where: {
        createdByUserId: creatorId,
        deletedAt: null,
      },
      include: taskRelation,
    });
  },
  findByStatus: async (status) => {
    return prisma.task.findMany({
      where: {
        status: status,
        deletedAt: null,
      },
      include: taskRelation,
    });
  },
  findByPriority: async (priority) => {
    return prisma.task.findMany({
      where: {
        priority: priority,
        deletedAt: null,
      },
      include: taskRelation,
    });
  },
  findByUserId: async (id) => {
    return prisma.task.findMany({
      where: {
        assignedToUserId: id,
        deletedAt: null,
      },
      include: taskRelation,
    });
  },
  update: async (id, data) => {
    return prisma.task.update({
      where: {
        id: id,
        deletedAt: null,
      },
      data: data,
      include: taskRelation,
    });
  },
  delete: async (id) => {
    return prisma.task.update({
      where: {
        id: id,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  },
  countPending: async () => {
    return prisma.task.count({
      where: {
        status: "PENDING",
        deletedAt: null,
      },
    });
  },
};

export default taskRepository;
