import prisma from "./prismaClient.js";

const userSelect = {
  id: true,
  username: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
  customers: {
    select: {
      id: true,
      name: true,
    },
  },
  contacts: {
    select: {
      id: true,
      email: true,
    },
  },
  leads: {
    select: {
      id: true,
      name: true,
    },
  },
  opportunities: {
    select: {
      id: true,
      name: true,
    },
  },
  taskAssigned: {
    select: {
      id: true,
      name: true,
    },
  },
  taskCreator: {
    select: {
      id: true,
      name: true,
    },
  },
  notes: {
    select: {
      id: true,
      content: true,
    },
  },
};
const userRepository = {
  create: async (data) => {
    return prisma.user.create({
      data: data,
      select: userSelect,
    });
  },
  allUserActive: async () => {
    return prisma.user.findMany({
      where: {
        deletedAt: null,
      },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },
  findById: async (id) => {
    return prisma.user.findUnique({
      where: {
        id: id,
        deletedAt: null,
      },
      select: userSelect,
    });
  },
  loginCheck: async (credential) => {
    return prisma.user.findFirst({
      where: {
        deletedAt: null,
        OR: [{ email: credential }, { username: credential }],
      },
    });
  },
  findActiveUser: async (id) => {
    return prisma.user.findUnique({
      where: {
        id: id,
        deletedAt: null,
      },
      select: userSelect,
    });
  },
  findByEmail: async (email) => {
    return prisma.user.findUnique({
      where: {
        email: email,
        deletedAt: null,
      },
      select: userSelect,
    });
  },
  findByUsername: async (username) => {
    return prisma.user.findUnique({
      where: {
        username: username,
        deletedAt: null,
      },
      select: userSelect,
    });
  },
  update: async (id, data) => {
    return prisma.user.update({
      where: {
        id: id,
        deletedAt: null,
      },
      data: data,
      select: userSelect,
    });
  },
  delete: async (id) => {
    return prisma.user.update({
      where: {
        id: id,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  },
  findByRole: async (role) => {
    return prisma.user.findMany({
      where: {
        role: role,
        deletedAt: null,
      },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },
  countActiveUser: async () => {
    return prisma.user.count({
      where: {
        deletedAt: null,
      },
    });
  },
};

export default userRepository;
