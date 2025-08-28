import request from "supertest";
import app from "./../src/app.js";
import {
  setupUsers,
  cleanupUsers,
  cleanupModels,
  makeDate,
  createCustomer,
  createLead,
  createOpportunity,
  createTask,
} from "./testHelpers.js";

describe("Task Endpoints", () => {
  let uniquePrefix;
  let userData;

  beforeAll(async () => {
    await cleanupModels("task_", ["task", "opportunity", "lead", "customer"]);
    await cleanupUsers("tsk_");
    uniquePrefix = `tsk_${Date.now()}`;
    userData = await setupUsers(uniquePrefix);
  });

  beforeEach(async () => {
    uniquePrefix = `task_${Date.now()}`;
  });

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
      const customer = await createCustomer(
        userData.sales1.token,
        uniquePrefix
      );
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
      const lead = await createLead(userData.sales1.token, uniquePrefix);
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
      const opportunity = await createOpportunity(
        userData.sales1.token,
        uniquePrefix
      );
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
      const customer = await createCustomer(
        userData.sales1.token,
        uniquePrefix
      );
      const lead = await createLead(
        userData.sales1.token,
        uniquePrefix,
        customer.id
      );
      const opportunity = await createOpportunity(
        userData.sales1.token,
        uniquePrefix,
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
      const task = await createTask(
        userData.manager.token,
        uniquePrefix,
        userData.sales1.id
      );
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
        .get(`/api/tasks?status=IN_PROGRESS`)
        .set("Authorization", `Bearer ${userData.admin.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
    });
    it("should fail to get tasks with invalid status", async () => {
      const response = await request(app)
        .get(`/api/tasks?status=INVALID`)
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
        .get(`/api/tasks?priority=INVALID`)
        .set("Authorization", `Bearer ${userData.admin.token}`);
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error");
    });
    it("should get tasks by assignedUserId (only admin)", async () => {
      const response = await request(app)
        .get(`/api/tasks?assignedUserId=${userData.sales1.id}`)
        .set("Authorization", `Bearer ${userData.admin.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
    });
    it("should fail to get tasks with invalid assignedUserId", async () => {
      const response = await request(app)
        .get(`/api/tasks?assignedUserId=9999`)
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
      const task = await createTask(
        userData.manager.token,
        uniquePrefix,
        userData.sales1.id
      );
      const customer = await createCustomer(userData.admin.token, uniquePrefix);
      const lead = await createLead(
        userData.admin.token,
        uniquePrefix,
        customer.id
      );
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
      const task = await createTask(
        userData.manager.token,
        uniquePrefix,
        userData.sales1.id
      );
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
      const task = await createTask(
        userData.manager.token,
        uniquePrefix,
        userData.sales2.id
      );
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
      const task = await createTask(
        userData.manager.token,
        uniquePrefix,
        userData.sales1.id
      );
      expect(task.assignedToUserId).toBe(userData.sales1.id);
      const response = await request(app)
        .delete(`/api/tasks/${task.id}`)
        .set("Authorization", `Bearer ${userData.manager.token}`);
      expect(response.statusCode).toBe(403);
      expect(response.body.status).toBe("error");
    });
  });
});
