import prisma from "./prismaClient.js";
const leadRepository = {
  create: async (data) => {
    return prisma.lead.create({
      data: data,
      include: {
        user: {
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
  all: async () => {
    return prisma.lead.findMany();
  },
  findById: async (id) => {
    const lead = await prisma.lead.findUnique({
      where: {
        id: id,
      },
      include: {
        user: {
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
  findByStatus: async (status) => {
    return prisma.lead.findMany({
      where: {
        status: status,
      },
      include: {
        user: {
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
  update: async (id, data) => {
    const updatedLead = await prisma.lead.update({
      where: {
        id: id,
      },
      data: data,
      include: {
        user: {
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
    return prisma.lead.delete({
      where: {
        id: id,
      },
    });
  },
};

export default leadRepository;
