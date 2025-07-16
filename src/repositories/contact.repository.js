import prisma from "./prismaClient.js";

const contactRepository = {
  createContact: async (data) => {
    return prisma.contact.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
  },
  findContactById: async (id) => {
    return prisma.contact.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
  },
  findContactByEmail: async (email) => {
    return prisma.contact.findUnique({
      where: { email },
    });
  },
  findAllContacts: async () => {
    return prisma.contact.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
  },
  updateContact: async (id, data) => {
    return prisma.contact.update({
      where: { id },
      data,
    });
  },
  deleteContact: async (id) => {
    return prisma.contact.delete({
      where: { id },
    });
  },
};

export default contactRepository;
