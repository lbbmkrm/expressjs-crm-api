import prisma from "./prismaClient.js";

const opportunityRepository = {
  create: async (data) => {
    return prisma.opportunity.create({
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
        lead: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  },
  all: async () => {
    return prisma.opportunity.findMany();
  },
  findById: async (id) => {
    return prisma.opportunity.findUnique({
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
        lead: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  },
  findByLeadId: async (leadId) => {
    return prisma.opportunity.findUnique({
      where: {
        leadId: leadId,
      },
    });
  },
  update: async (id, data) => {
    return prisma.opportunity.update({
      where: {
        id: id,
      },
      data: data,
    });
  },
  delete: async (id) => {
    return prisma.opportunity.delete({
      where: {
        id: id,
      },
    });
  },
};

export default opportunityRepository;
