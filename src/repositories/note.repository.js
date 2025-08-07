import prisma from "./prismaClient.js";

const noteRelation = {
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
};
const noteRepository = {
  create: async (data) => {
    return prisma.note.create({
      data: data,
      include: noteRelation,
    });
  },
  all: async () => {
    return prisma.note.findMany({
      where: {
        deletedAt: null,
      },
    });
  },
  findByUserId: async (id) => {
    return prisma.note.findMany({
      where: {
        createdByUserId: id,
        deletedAt: null,
      },
    });
  },
  findById: async (id) => {
    return prisma.note.findUnique({
      where: {
        id: id,
        deletedAt: null,
      },
      include: noteRelation,
    });
  },
  findByCustomerId: async (customerId) => {
    return prisma.note.findMany({
      where: {
        customerId: customerId,
        deletedAt: null,
      },
      include: noteRelation,
    });
  },
  findByLeadId: async (leadId) => {
    return prisma.note.findMany({
      where: {
        leadId: leadId,
        deletedAt: null,
      },
      include: noteRelation,
    });
  },
  update: async (id, data) => {
    return prisma.note.update({
      where: {
        id: id,
        deletedAt: null,
      },
      data: data,
    });
  },
  delete: async (id) => {
    return prisma.note.update({
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

export default noteRepository;
