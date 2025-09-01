import prisma from "./prismaClient.js";

const ticketRelation = {
  creator: {
    select: {
      id: true,
      username: true,
    },
  },
  assignedToUser: {
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
  documents: true,
};

const ticketRepository = {
  all: async (query) => {
    const { status, creator } = query;
    const whereClause = {
      deletedAt: null,
    };
    if (status) {
      whereClause.status = status;
    }
    if (creator) {
      whereClause.createdByUserId = creator;
    }
    return prisma.ticket.findMany({
      where: whereClause,
    });
  },
  findById: async (id) => {
    return prisma.ticket.findUnique({
      where: {
        id: id,
        deletedAt: null,
      },
      include: ticketRelation,
    });
  },
  findByAssignedId: async (assigneeId) => {
    return prisma.ticket.findMany({
      where: {
        assignedToUserId: assigneeId,
        deletedAt: null,
      },
      include: ticketRelation,
    });
  },
  create: async (data) => {
    return prisma.ticket.create({
      data: data,
      include: ticketRelation,
    });
  },
  update: async (id, data) => {
    return prisma.ticket.update({
      where: {
        id: id,
        deletedAt: null,
      },
      data: data,
      include: ticketRelation,
    });
  },
  softDelete: async (id) => {
    return prisma.ticket.update({
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

export default ticketRepository;
