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
    return prisma.note.findMany();
  },
  findByUserId: async (id) => {
    return prisma.note.findMany({
      where: {
        createdByUserId: id,
      },
    });
  },
  findById: async (id) => {
    return prisma.note.findUnique({
      where: {
        id: id,
      },
      include: noteRelation,
    });
  },
  findByCustomerId: async (customerId) => {
    return prisma.note.findMany({
      where: {
        customerId: customerId,
      },
      include: noteRelation,
    });
  },
  update: async (id, data) => {
    return prisma.note.update({
      where: {
        id: id,
      },
      data: data,
    });
  },
  delete: async (id) => {
    return prisma.note.delete({
      where: {
        id: id,
      },
    });
  },
};

export default noteRepository;
