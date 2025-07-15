import prisma from "./prismaClient.js";

const customerRepository = {
  createCustomer: async (data) => {
    return prisma.customer.create({
      data,
    });
  },
  findCustomerById: async (id) => {
    return prisma.customer.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        company: true,
        createdAt: true,
        updatedAt: true,
        createdByUserId: true,
        user: { select: { id: true, username: true } },
      },
    });
  },
  findCustomerByEmail: async (email) => {
    return prisma.customer.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        company: true,
        createdAt: true,
        updatedAt: true,
        createdByUserId: true,
      },
    });
  },
  findAllCustomers: async () => {
    return prisma.customer.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        company: true,
        createdAt: true,
        updatedAt: true,
        createdByUserId: true,
        user: { select: { id: true, username: true } },
      },
    });
  },
  updateCustomer: async (id, data) => {
    return prisma.customer.update({
      where: { id: id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        company: true,
        createdAt: true,
        updatedAt: true,
        createdByUserId: true,
      },
    });
  },
  deleteCustomer: async (id) => {
    return prisma.customer.delete({
      where: { id },
    });
  },
};

export default customerRepository;
