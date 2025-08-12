import request from "supertest";
import app from "./../src/app.js";
import prisma from "./../src/repositories/prismaClient.js";

describe("Task Endpoints", () => {
  let uniquePrefix;
  const userData = {
    admin: {
      username: "",
      email: "",
      password: "password123",
      token: "",
      id: null,
    },
    sales1: {
      username: "",
      email: "",
      password: "password123",
      token: "",
      id: null,
    },
    sales2: {
      username: "",
      email: "",
      password: "password123",
      token: "",
      id: null,
    },
    manager: {
      username: "",
      email: "",
      password: "password123",
      token: "",
      id: null,
    },
    viewer: {
      username: "",
      email: "",
      password: "password123",
      token: "",
      id: null,
    },
  };

  beforeAll(async () => {
    await prisma.task.deleteMany({
      where: {
        name: { startsWith: "task_" },
      },
    });
    await prisma.opportunity.deleteMany({
      where: {
        name: { startsWith: "task_" },
      },
    });
    await prisma.lead.deleteMany({
      where: {
        name: { startsWith: "task_" },
      },
    });
    await prisma.customer.deleteMany({
      where: {
        name: { startsWith: "task_" },
      },
    });
    await prisma.user.deleteMany({
      where: {
        username: { startsWith: "tsk_" },
      },
    });

    uniquePrefix = `tsk_${Date.now()}`;
    userData.admin.username = `${uniquePrefix}_admin`;
    userData.admin.email = `${uniquePrefix}_admin@example.com`;
    userData.sales1.username = `${uniquePrefix}_sales1`;
    userData.sales1.email = `${uniquePrefix}_sales1@example.com`;
    userData.sales2.username = `${uniquePrefix}_sales2`;
    userData.sales2.email = `${uniquePrefix}_sales2@example.com`;
    userData.manager.username = `${uniquePrefix}_manager`;
    userData.manager.email = `${uniquePrefix}_manager@example.com`;
    userData.viewer.username = `${uniquePrefix}_viewer`;
    userData.viewer.email = `${uniquePrefix}_viewer@example.com`;

    await request(app).post("/api/auth/register").send({
      username: userData.admin.username,
      email: userData.admin.email,
      password: userData.admin.password,
    });
    await request(app).post("/api/auth/register").send({
      username: userData.sales1.username,
      email: userData.sales1.email,
      password: userData.sales1.password,
    });
    await request(app).post("/api/auth/register").send({
      username: userData.sales2.username,
      email: userData.sales2.email,
      password: userData.sales2.password,
    });
    await request(app).post("/api/auth/register").send({
      username: userData.manager.username,
      email: userData.manager.email,
      password: userData.manager.password,
    });
    await request(app).post("/api/auth/register").send({
      username: userData.viewer.username,
      email: userData.viewer.email,
      password: userData.viewer.password,
    });

    await prisma.user.update({
      where: { username: userData.admin.username },
      data: { role: "ADMIN" },
    });
    await prisma.user.update({
      where: { username: userData.sales1.username },
      data: { role: "SALES" },
    });
    await prisma.user.update({
      where: { username: userData.sales2.username },
      data: { role: "SALES" },
    });
    await prisma.user.update({
      where: { username: userData.manager.username },
      data: { role: "MANAGER" },
    });
    await prisma.user.update({
      where: { username: userData.viewer.username },
      data: { role: "VIEWER" },
    });

    const admin = await prisma.user.findUnique({
      where: { username: userData.admin.username },
      select: {
        id: true,
      },
    });
    userData.admin.id = admin.id;

    const sales1 = await prisma.user.findUnique({
      where: { username: userData.sales1.username },
      select: {
        id: true,
      },
    });
    userData.sales1.id = sales1.id;

    const sales2 = await prisma.user.findUnique({
      where: { username: userData.sales2.username },
      select: {
        id: true,
      },
    });
    userData.sales2.id = sales2.id;

    const manager = await prisma.user.findUnique({
      where: { username: userData.manager.username },
      select: {
        id: true,
      },
    });
    userData.manager.id = manager.id;

    const viewer = await prisma.user.findUnique({
      where: { username: userData.viewer.username },
      select: {
        id: true,
      },
    });
    userData.viewer.id = viewer.id;

    const loginAdmin = await request(app).post("/api/auth/login").send({
      emailOrUsername: userData.admin.email,
      password: userData.admin.password,
    });
    userData.admin.token = loginAdmin.body.token;

    const loginSales1 = await request(app).post("/api/auth/login").send({
      emailOrUsername: userData.sales1.email,
      password: userData.sales1.password,
    });
    userData.sales1.token = loginSales1.body.token;

    const loginSales2 = await request(app).post("/api/auth/login").send({
      emailOrUsername: userData.sales2.email,
      password: userData.sales2.password,
    });
    userData.sales2.token = loginSales2.body.token;

    const loginManager = await request(app).post("/api/auth/login").send({
      emailOrUsername: userData.manager.email,
      password: userData.manager.password,
    });
    userData.manager.token = loginManager.body.token;

    const loginUser = await request(app).post("/api/auth/login").send({
      emailOrUsername: userData.viewer.email,
      password: userData.viewer.password,
    });
    userData.viewer.token = loginUser.body.token;
  });

  beforeEach(async () => {
    uniquePrefix = `task_${Date.now()}`;
  });

  const cleanupData = async () => {
    await prisma.task.deleteMany({
      where: {
        name: {
          startsWith: "task_",
        },
      },
    });
    await prisma.opportunity.deleteMany({
      where: {
        name: {
          startsWith: "task_",
        },
      },
    });
    await prisma.lead.deleteMany({
      where: {
        name: {
          startsWith: "task_",
        },
      },
    });
    await prisma.customer.deleteMany({
      where: {
        name: {
          startsWith: "task_",
        },
      },
    });
    await prisma.user.deleteMany({
      where: {
        username: {
          startsWith: "tsk_",
        },
      },
    });
  };

  const makeDate = (day) => {
    const time = new Date();
    time.setDate(time.getDate() + day);
    return time;
  };

  const createCustomer = async (token) => {
    const response = await request(app)
      .post("/api/customers")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: `${uniquePrefix}_Customer`,
        email: `${uniquePrefix}_cust@example.com`,
        phone: "1234567890",
        company: `${uniquePrefix}_Company`,
        address: `${uniquePrefix} Address St`,
      });
    return response.body.data;
  };

  const createLead = async (token, customerId = null) => {
    const leadData = {
      name: `${uniquePrefix}_Lead`,
      email: `${uniquePrefix}_lead@example.com`,
      phone: "1234567890",
      status: "NEW",
    };

    if (customerId) {
      leadData.customerId = customerId;
    }

    const response = await request(app)
      .post("/api/leads")
      .set("Authorization", `Bearer ${token}`)
      .send(leadData);
    return response.body.data;
  };

  const createOpportunity = async (token, customerId = null, leadId = null) => {
    const opportunityData = {
      name: `${uniquePrefix}_Opportunity`,
      amount: 10000.0,
      stage: "QUALIFICATION",
      description: `${uniquePrefix} opportunity description`,
    };

    if (customerId) {
      opportunityData.customerId = customerId;
    }
    if (leadId) {
      opportunityData.leadId = leadId;
    }

    const response = await request(app)
      .post("/api/opportunities")
      .set("Authorization", `Bearer ${token}`)
      .send(opportunityData);
    return response.body.data;
  };

  const createTask = async (
    token,
    assignedToUserId,
    customerId = null,
    leadId = null,
    opportunityId = null
  ) => {
    const taskData = {
      name: `${uniquePrefix}_Task`,
      assignedToUserId: assignedToUserId,
      description: `${uniquePrefix}_Task_Description`,
      dueDate: makeDate(1),
    };

    if (customerId) {
      taskData.customerId = customerId;
    }
    if (leadId) {
      taskData.leadId = leadId;
    }
    if (opportunityId) {
      taskData.opportunityId = opportunityId;
    }

    const response = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send(taskData);
    return response.body.data;
  };

  describe("POST /api/tasks", () => {
    it("should create a task for admin and manager", async () => {
      const response = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${userData.manager.token}`)
        .send({
          name: `${uniquePrefix}_Task`,
          assignedToUserId: userData.sales1.id,
          description: `${uniquePrefix}_Task_Description`,
          dueDate: makeDate(1),
        });
      expect(response.statusCode).toBe(201);
      expect(response.body.status).toBe("success");
    });
    it("should create task with customerId", async () => {
      const customer = await createCustomer(userData.sales1.token);
      const response = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${userData.manager.token}`)
        .send({
          name: `${uniquePrefix}_Task`,
          assignedToUserId: userData.sales1.id,
          customerId: customer.id,
          description: `${uniquePrefix}_Task_Description`,
          dueDate: makeDate(1),
        });
      expect(response.statusCode).toBe(201);
      expect(response.body.status).toBe("success");
    });
    it("should create task with leadId", async () => {
      const lead = await createLead(userData.sales1.token);
      const response = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${userData.manager.token}`)
        .send({
          name: `${uniquePrefix}_Task`,
          assignedToUserId: userData.sales1.id,
          leadId: lead.id,
          description: `${uniquePrefix}_Task_Description`,
          dueDate: makeDate(1),
        });
      expect(response.statusCode).toBe(201);
      expect(response.body.status).toBe("success");
    });
    it("should create task with opportunityId", async () => {
      const opportunity = await createOpportunity(userData.sales1.token);
      const response = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${userData.manager.token}`)
        .send({
          name: `${uniquePrefix}_Task`,
          assignedToUserId: userData.sales1.id,
          opportunityId: opportunity.id,
          description: `${uniquePrefix}_Task_Description`,
          dueDate: makeDate(1),
        });
      expect(response.statusCode).toBe(201);
      expect(response.body.status).toBe("success");
    });
    it("should create task with customerId, leadId and opportunityId", async () => {
      const customer = await createCustomer(userData.sales1.token);
      const lead = await createLead(userData.sales1.token, customer.id);
      const opportunity = await createOpportunity(
        userData.sales1.token,
        customer.id,
        lead.id
      );
      const response = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${userData.manager.token}`)
        .send({
          name: `${uniquePrefix}_Task`,
          assignedToUserId: userData.sales1.id,
          customerId: customer.id,
          leadId: lead.id,
          opportunityId: opportunity.id,
          description: `${uniquePrefix}_Task_Description`,
          dueDate: makeDate(1),
        });
      expect(response.statusCode).toBe(201);
      expect(response.body.status).toBe("success");
    });
    it("should fail create task with invalid assignedUserId", async () => {
      const response = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .send({
          name: `${uniquePrefix}_Task`,
          assignedToUserId: 9999,
          description: `${uniquePrefix}_Task_Description`,
          dueDate: makeDate(1),
        });
      expect(response.statusCode).toBe(404);
      expect(response.body.status).toBe("error");
    });
    it("should fail to create task with invalid customerId", async () => {
      const response = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .send({
          name: `${uniquePrefix}_Task`,
          assignedToUserId: userData.sales1.id,
          customerId: 9999,
          description: `${uniquePrefix}_Task_Description`,
          dueDate: makeDate(1),
        });
      expect(response.statusCode).toBe(404);
      expect(response.body.status).toBe("error");
    });
    it("should fail to create task with invalid leadId", async () => {
      const response = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .send({
          name: `${uniquePrefix}_Task`,
          assignedToUserId: userData.sales1.id,
          leadId: 9999,
          description: `${uniquePrefix}_Task_Description`,
          dueDate: makeDate(1),
        });
      expect(response.statusCode).toBe(404);
      expect(response.body.status).toBe("error");
    });
    it("should fail to create task with invalid opportunityId", async () => {
      const response = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .send({
          name: `${uniquePrefix}_Task`,
          assignedToUserId: userData.sales1.id,
          opportunityId: 9999,
          description: `${uniquePrefix}_Task_Description`,
          dueDate: makeDate(1),
        });
      expect(response.statusCode).toBe(404);
      expect(response.body.status).toBe("error");
    });
    it("should fail to create task with invalid dueDate(past time)", async () => {
      const response = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .send({
          name: `${uniquePrefix}_Task`,
          assignedToUserId: userData.sales1.id,
          description: `${uniquePrefix}_Task_Description`,
          dueDate: makeDate(-1),
        });
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error");
    });
  });
  describe("GET /api/tasks", () => {
    it("should get all tasks (only admin)", async () => {
      const response = await request(app)
        .get("/api/tasks")
        .set("Authorization", `Bearer ${userData.admin.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
    });
    it("should get task by id (for admin, creator and asigned user)", async () => {
      const task = await createTask(userData.manager.token, userData.sales1.id);
      expect(task.assignedToUserId).toBe(userData.sales1.id);
      const response = await request(app)
        .get(`/api/tasks/${task.id}`)
        .set("Authorization", `Bearer ${userData.sales1.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
    });
    it("should fail to get task with invalid id", async () => {
      const response = await request(app)
        .get(`/api/tasks/9999`)
        .set("Authorization", `Bearer ${userData.sales1.token}`);
      expect(response.statusCode).toBe(404);
      expect(response.body.status).toBe("error");
    });
    it("should get tasks by status (only admin)", async () => {
      const response = await request(app)
        .get(`/api/tasks/status/PENDING`)
        .set("Authorization", `Bearer ${userData.admin.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
    });
    it("should fail to get tasks with invalid status", async () => {
      const response = await request(app)
        .get(`/api/tasks/status/INVALID`)
        .set("Authorization", `Bearer ${userData.admin.token}`);
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error");
    });
    it("should get tasks by priority (only admin)", async () => {
      const response = await request(app)
        .get(`/api/tasks?priority=HIGH`)
        .set("Authorization", `Bearer ${userData.admin.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
    });
    it("should fail to get tasks with invalid priority", async () => {
      const response = await request(app)
        .get(`/api/tasks/priority/INVALID`)
        .set("Authorization", `Bearer ${userData.admin.token}`);
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error");
    });
    it("should get tasks by assignedUserId (only admin)", async () => {
      const response = await request(app)
        .get(`/api/tasks/assigned/${userData.sales1.id}`)
        .set("Authorization", `Bearer ${userData.admin.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
    });
    it("should fail to get tasks with invalid assignedUserId", async () => {
      const response = await request(app)
        .get(`/api/tasks/assigned/9999`)
        .set("Authorization", `Bearer ${userData.admin.token}`);
      expect(response.statusCode).toBe(404);
      expect(response.body.status).toBe("error");
    });
    it("should get my tasks", async () => {
      const response = await request(app)
        .get("/api/tasks/my-tasks")
        .set("Authorization", `Bearer ${userData.sales1.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
    });
  });
  describe("PATCH /api/tasks/:id", () => {
    it("should update task (only admin and manager)", async () => {
      const task = await createTask(userData.manager.token, userData.sales1.id);
      const customer = await createCustomer(userData.admin.token);
      const lead = await createLead(userData.admin.token, customer.id);
      expect(task.assignedToUserId).toBe(userData.sales1.id);
      const response = await request(app)
        .patch(`/api/tasks/${task.id}`)
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .send({
          name: `${uniquePrefix}_Task_Updated`,
          description: `${uniquePrefix}_Task_Description_Updated`,
          dueDate: makeDate(4),
          priority: "HIGH",
          status: "IN_PROGRESS",
          customerId: customer.id,
          leadId: lead.id,
        });
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
    });
    it("should fail to update task with invalid id", async () => {
      const response = await request(app)
        .patch(`/api/tasks/9999`)
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .send({
          name: `${uniquePrefix}_Task_Updated`,
          description: `${uniquePrefix}_Task_Description_Updated`,
          dueDate: makeDate(4),
          priority: "HIGH",
          status: "IN_PROGRESS",
        });
      expect(response.statusCode).toBe(404);
      expect(response.body.status).toBe("error");
    });
    it("should fail to update task by assigned user", async () => {
      const task = await createTask(userData.manager.token, userData.sales1.id);
      expect(task.assignedToUserId).toBe(userData.sales1.id);
      const response = await request(app)
        .patch(`/api/tasks/${task.id}`)
        .set("Authorization", `Bearer ${userData.sales1.token}`)
        .send({
          name: `${uniquePrefix}_Task_Updated`,
          description: `${uniquePrefix}_Task_Description_Updated`,
          dueDate: makeDate(4),
          priority: "LOW",
          status: "COMPLETED",
        });
      expect(response.statusCode).toBe(403);
      expect(response.body.status).toBe("error");
    });
  });
  describe("DELETE /api/tasks/:id", () => {
    it("should delete task (only admin)", async () => {
      const task = await createTask(userData.manager.token, userData.sales2.id);
      const response = await request(app)
        .delete(`/api/tasks/${task.id}`)
        .set("Authorization", `Bearer ${userData.admin.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
    });
    it("should fail to delete task with invalid id", async () => {
      const response = await request(app)
        .delete(`/api/tasks/9999`)
        .set("Authorization", `Bearer ${userData.admin.token}`);
      expect(response.statusCode).toBe(404);
      expect(response.body.status).toBe("error");
    });
    it("should fail to delete task by not authorized role", async () => {
      const task = await createTask(userData.manager.token, userData.sales1.id);
      expect(task.assignedToUserId).toBe(userData.sales1.id);
      const response = await request(app)
        .delete(`/api/tasks/${task.id}`)
        .set("Authorization", `Bearer ${userData.manager.token}`);
      expect(response.statusCode).toBe(403);
      expect(response.body.status).toBe("error");
    });
  });
  afterAll(async () => {
    await cleanupData();
    await prisma.user.deleteMany({
      where: { username: { startsWith: "tsk_" } },
    });
  });
});
