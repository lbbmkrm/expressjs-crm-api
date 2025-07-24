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
  all: async () => {
    return prisma.task.findMany();
  },
  findById: async (id) => {
    return prisma.task.findUnique({
      where: {
        id: id,
      },
      include: taskRelation,
    });
  },
  findByAssignedUserId: async (assignedUserId) => {
    return prisma.task.findMany({
      where: {
        assignedToUserId: assignedUserId,
      },
      include: taskRelation,
    });
  },
  findByStatus: async (status) => {
    return prisma.task.findMany({
      where: {
        status: status,
      },
      include: taskRelation,
    });
  },
  findByPriority: async (priority) => {
    return prisma.task.findMany({
      where: {
        priority: priority,
      },
      include: taskRelation,
    });
  },
  update: async (id, data) => {
    return prisma.task.update({
      where: {
        id: id,
      },
      data: data,
      include: taskRelation,
    });
  },
  delete: async (id) => {
    return prisma.task.delete({
      where: {
        id: id,
      },
    });
  },
};

export default taskRepository;
