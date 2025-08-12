import request from "supertest";
import app from "./../src/app.js";
import prisma from "./../src/repositories/prismaClient.js";

describe("Lead Endpoints", () => {
  let uniquePrefix;

  const cleanupData = async () => {
    await prisma.lead.deleteMany({
      where: { name: { startsWith: "lead_" } },
    });
    await prisma.customer.deleteMany({
      where: { name: { startsWith: "lead_" } },
    });
    await prisma.user.deleteMany({
      where: { email: { startsWith: "ld_" } },
    });
  };
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
    await cleanupData();
    uniquePrefix = `ld_${Date.now()}`;
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

  beforeEach(() => {
    uniquePrefix = `lead_${Date.now()}`;
  });

  const cleanupDataConvert = async () => {
    await prisma.opportunity.deleteMany({
      where: { name: { startsWith: "Opportunity from lead_" } },
    });
    await prisma.contact.deleteMany({
      where: { firstName: { startsWith: "lead_" } },
    });

    await prisma.lead.deleteMany({
      where: { name: { startsWith: "lead_" } },
    });
    await prisma.customer.deleteMany({
      where: {
        OR: [
          { name: { startsWith: "lead_" } },
          { email: { startsWith: "lead_" } },
        ],
      },
    });
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

  describe("POST /api/leads", () => {
    it("should create a new lead (all roles except VIEWER)", async () => {
      const response = await request(app)
        .post("/api/leads")
        .set("Authorization", `Bearer ${userData.sales1.token}`)
        .send({
          name: `${uniquePrefix}_Lead`,
          email: `${uniquePrefix}_lead@example.com`,
          phone: "1234567890",
          status: "NEW",
        });
      expect(response.statusCode).toBe(201);
      expect(response.body.status).toBe("success");
    });

    it("should create a lead with customer ID", async () => {
      const customer = await createCustomer(userData.sales1.token);
      const response = await request(app)
        .post("/api/leads")
        .set("Authorization", `Bearer ${userData.sales1.token}`)
        .send({
          name: `${uniquePrefix}_Lead`,
          email: `${uniquePrefix}_lead@example.com`,
          phone: "1234567890",
          status: "NEW",
          customerId: customer.id,
        });
      expect(response.statusCode).toBe(201);
      expect(response.body.status).toBe("success");
      expect(response.body.data.customerId).toBe(customer.id);
    });

    it("should fail to create lead by VIEWER", async () => {
      const response = await request(app)
        .post("/api/leads")
        .set("Authorization", `Bearer ${userData.viewer.token}`)
        .send({
          name: `${uniquePrefix}_Lead`,
          email: `${uniquePrefix}_lead@example.com`,
          phone: "1234567890",
          status: "NEW",
        });
      expect(response.statusCode).toBe(403);
    });

    it("should fail to create lead with invalid data", async () => {
      const response = await request(app)
        .post("/api/leads")
        .set("Authorization", `Bearer ${userData.sales1.token}`)
        .send({
          name: "",
          email: "invalid-email",
          phone: "",
        });
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error");
    });

    it("should fail to create lead with invalid status", async () => {
      const customer = await createCustomer(userData.sales1.token);
      const response = await request(app)
        .post("/api/leads")
        .set("Authorization", `Bearer ${userData.sales1.token}`)
        .send({
          name: `${uniquePrefix}_Lead`,
          email: `${uniquePrefix}_lead@example.com`,
          phone: "1234567890",
          status: "INVALID_STATUS",
          customerId: customer.id,
        });
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error");
    });
  });

  describe("GET /api/leads", () => {
    it("should get all leads for all roles", async () => {
      const response = await request(app)
        .get("/api/leads")
        .set("Authorization", `Bearer ${userData.sales1.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
    });

    it("should get leads with status filter", async () => {
      const response = await request(app)
        .get("/api/leads?status=NEW")
        .set("Authorization", `Bearer ${userData.sales1.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
    });

    it("should get a lead by ID", async () => {
      const lead = await createLead(userData.sales2.token);
      const response = await request(app)
        .get(`/api/leads/${lead.id}`)
        .set("Authorization", `Bearer ${userData.sales2.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data.id).toBe(lead.id);
    });

    it("should fail to get lead with invalid id", async () => {
      const response = await request(app)
        .get("/api/leads/99999")
        .set("Authorization", `Bearer ${userData.sales2.token}`);
      expect(response.statusCode).toBe(404);
      expect(response.body.status).toBe("error");
    });
  });

  describe("PATCH /api/leads/:id", () => {
    it("should update a lead", async () => {
      const lead = await createLead(userData.sales1.token);
      expect(lead.name).toBe(`${uniquePrefix}_Lead`);
      const response = await request(app)
        .patch(`/api/leads/${lead.id}`)
        .set("Authorization", `Bearer ${userData.sales1.token}`)
        .send({
          name: `${uniquePrefix}_Lead_Updated`,
          status: "CONTACTED",
        });
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data.name).toBe(`${uniquePrefix}_Lead_Updated`);
      expect(response.body.data.status).toBe("CONTACTED");
    });

    it("should fail to update lead with invalid id", async () => {
      const response = await request(app)
        .patch("/api/leads/99999")
        .set("Authorization", `Bearer ${userData.sales1.token}`)
        .send({
          name: `${uniquePrefix}_Lead_Updated`,
        });
      expect(response.statusCode).toBe(404);
      expect(response.body.status).toBe("error");
    });

    it("should update customerId", async () => {
      const lead = await createLead(userData.sales1.token);
      expect(lead.customerId).toBe(null);
      const customer = await createCustomer(userData.sales1.token);
      const response = await request(app)
        .patch(`/api/leads/${lead.id}`)
        .set("Authorization", `Bearer ${userData.sales1.token}`)
        .send({
          customerId: customer.id,
        });
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data.customerId).toBe(customer.id);
    });

    it("should fail to update with invalid customerId", async () => {
      const lead = await createLead(userData.sales1.token);
      expect(lead.customerId).toBe(null);
      const response = await request(app)
        .patch(`/api/leads/${lead.id}`)
        .set("Authorization", `Bearer ${userData.sales1.token}`)
        .send({
          customerId: 99999,
        });
      expect(response.statusCode).toBe(404);
      expect(response.body.status).toBe("error");
    });

    it("should update a lead by ADMIN", async () => {
      const lead = await createLead(userData.sales1.token);
      expect(lead.name).toBe(`${uniquePrefix}_Lead`);
      const response = await request(app)
        .patch(`/api/leads/${lead.id}`)
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .send({
          name: `${uniquePrefix}_Lead_Updated_by_Admin`,
          status: "WON",
        });
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data.name).toBe(
        `${uniquePrefix}_Lead_Updated_by_Admin`
      );
      expect(response.body.data.status).toBe("WON");
    });

    it("should fail to update a non-owned lead", async () => {
      const lead = await createLead(userData.sales1.token);
      expect(lead.createdByUserId).not.toBe(userData.sales2.id);
      const response = await request(app)
        .patch(`/api/leads/${lead.id}`)
        .set("Authorization", `Bearer ${userData.sales2.token}`)
        .send({
          name: `${uniquePrefix}_Lead_Updated`,
        });
      expect(response.statusCode).toBe(403);
      expect(response.body.status).toBe("error");
    });
  });

  describe("DELETE /api/leads/:id", () => {
    it("should delete a lead", async () => {
      const lead = await createLead(userData.sales1.token);
      expect(lead.name).toBe(`${uniquePrefix}_Lead`);
      const response = await request(app)
        .delete(`/api/leads/${lead.id}`)
        .set("Authorization", `Bearer ${userData.sales1.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
    });

    it("should fail to delete lead with invalid id", async () => {
      const response = await request(app)
        .delete("/api/leads/99999")
        .set("Authorization", `Bearer ${userData.sales1.token}`);
      expect(response.statusCode).toBe(404);
      expect(response.body.status).toBe("error");
    });

    it("should delete a lead by ADMIN", async () => {
      const lead = await createLead(userData.sales1.token);
      expect(lead.name).toBe(`${uniquePrefix}_Lead`);
      const response = await request(app)
        .delete(`/api/leads/${lead.id}`)
        .set("Authorization", `Bearer ${userData.admin.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
    });

    it("should fail to delete a non-owned lead", async () => {
      const lead = await createLead(userData.sales1.token);
      expect(lead.createdByUserId).not.toBe(userData.sales2.id);
      const response = await request(app)
        .delete(`/api/leads/${lead.id}`)
        .set("Authorization", `Bearer ${userData.sales2.token}`);
      expect(response.statusCode).toBe(403);
      expect(response.body.status).toBe("error");
    });
  });

  describe("GET lead relations", () => {
    it("should get lead activities for admin and manager", async () => {
      const lead = await createLead(userData.sales1.token);
      const response = await request(app)
        .get(`/api/leads/${lead.id}/activities`)
        .set("Authorization", `Bearer ${userData.manager.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data).toBeDefined();
    });

    it("should get lead notes for admin and manager", async () => {
      const lead = await createLead(userData.sales1.token);
      const response = await request(app)
        .get(`/api/leads/${lead.id}/notes`)
        .set("Authorization", `Bearer ${userData.manager.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data).toBeDefined();
    });

    it("should get lead opportunities (all roles)", async () => {
      const lead = await createLead(userData.sales1.token);
      expect(lead.name).toBe(`${uniquePrefix}_Lead`);
      const response = await request(app)
        .get(`/api/leads/${lead.id}/opportunities`)
        .set("Authorization", `Bearer ${userData.viewer.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data).toBeDefined();
    });
  });

  describe("POST /api/leads/:id/convert", () => {
    it("should convert a lead", async () => {
      const lead = await createLead(userData.sales1.token);

      const response = await request(app)
        .post(`/api/leads/${lead.id}/convert`)
        .set("Authorization", `Bearer ${userData.sales1.token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.message).toBe("Lead converted successfully");
      expect(response.body.data).toHaveProperty("customer");
      expect(response.body.data).toHaveProperty("contact");
      expect(response.body.data).toHaveProperty("opportunity");

      const updatedLead = await request(app)
        .get(`/api/leads/${lead.id}`)
        .set("Authorization", `Bearer ${userData.sales1.token}`);

      expect(updatedLead.body.data.status).toBe("CONVERTED");
      await cleanupDataConvert();
    });

    it("should fail to convert already converted lead", async () => {
      const lead = await createLead(userData.sales1.token);

      const response1 = await request(app)
        .post(`/api/leads/${lead.id}/convert`)
        .set("Authorization", `Bearer ${userData.sales1.token}`);
      expect(response1.statusCode).toBe(200);

      const response2 = await request(app)
        .post(`/api/leads/${lead.id}/convert`)
        .set("Authorization", `Bearer ${userData.sales1.token}`);

      expect(response2.statusCode).toBe(400);
      expect(response2.body.status).toBe("error");
    });

    it("should fail to convert lead with invalid id", async () => {
      const response = await request(app)
        .post("/api/leads/99999/convert")
        .set("Authorization", `Bearer ${userData.sales1.token}`);

      expect(response.statusCode).toBe(404);
      expect(response.body.status).toBe("error");
    });

    it("should allow ADMIN to convert any lead", async () => {
      const lead = await createLead(userData.sales1.token);

      const response = await request(app)
        .post(`/api/leads/${lead.id}/convert`)
        .set("Authorization", `Bearer ${userData.admin.token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data).toHaveProperty("customer");
      expect(response.body.data).toHaveProperty("contact");
      expect(response.body.data).toHaveProperty("opportunity");
      await cleanupDataConvert();
    });

    it("should fail when non-owner tries to convert lead", async () => {
      const lead = await createLead(userData.sales1.token);

      const response = await request(app)
        .post(`/api/leads/${lead.id}/convert`)
        .set("Authorization", `Bearer ${userData.sales2.token}`);

      expect(response.statusCode).toBe(403);
      expect(response.body.status).toBe("error");
    });
  });
});
