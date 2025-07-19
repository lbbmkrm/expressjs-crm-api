import prisma from "./prismaClient.js";
const leadRepository = {
  createLead: async (data) => {
    return prisma.lead.create({
      data,
    });
  },
  findAllLeads: async () => {
    return prisma.lead.findMany({});
  },
  findLeadById: async (id) => {
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
  updateLead: async (id, data) => {
    const updatedLead = await prisma.lead.update({
      where: {
        id: id,
      },
      data: data,
    });
    return updatedLead;
  },
  deleteLead: async (id) => {
    return prisma.lead.delete({
      where: {
        id: id,
      },
    });
  },
};

export default leadRepository;
