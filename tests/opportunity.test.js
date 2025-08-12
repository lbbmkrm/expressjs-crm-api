import request from "supertest";
import app from "./../src/app.js";
import prisma from "./../src/repositories/prismaClient.js";

describe("Opportunity Endpoints", () => {
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
    await prisma.opportunity.deleteMany({
      where: { name: { startsWith: "opp_" } },
    });
    await prisma.lead.deleteMany({
      where: { name: { startsWith: "opp_" } },
    });
    await prisma.customer.deleteMany({
      where: { name: { startsWith: "opp_" } },
    });
    await prisma.user.deleteMany({
      where: { email: { startsWith: "opp_" } },
    });

    uniquePrefix = `opp_${Date.now()}`;
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

    userData.admin.id = (
      await prisma.user.findUnique({ where: { email: userData.admin.email } })
    ).id;
    userData.sales1.id = (
      await prisma.user.findUnique({ where: { email: userData.sales1.email } })
    ).id;
    userData.sales2.id = (
      await prisma.user.findUnique({ where: { email: userData.sales2.email } })
    ).id;
    userData.manager.id = (
      await prisma.user.findUnique({ where: { email: userData.manager.email } })
    ).id;
    userData.viewer.id = (
      await prisma.user.findUnique({ where: { email: userData.viewer.email } })
    ).id;

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
    uniquePrefix = `opp_${Date.now()}`;
  });

  const cleanupData = async () => {
    await prisma.opportunity.deleteMany({
      where: { name: { startsWith: "opp_" } },
    });
    await prisma.lead.deleteMany({
      where: { name: { startsWith: "opp_" } },
    });
    await prisma.customer.deleteMany({
      where: { name: { startsWith: "opp_" } },
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

  describe("POST /api/opportunities", () => {
    it("should create a new opportunity (all roles except VIEWER)", async () => {
      const response = await request(app)
        .post("/api/opportunities")
        .set("Authorization", `Bearer ${userData.sales1.token}`)
        .send({
          name: `${uniquePrefix}_Opportunity`,
          amount: 10000.0,
          stage: "QUALIFICATION",
          description: `${uniquePrefix} opportunity description`,
        });
      expect(response.statusCode).toBe(201);
      expect(response.body.status).toBe("success");
    });

    it("should create opportunity with customerId", async () => {
      const customer = await createCustomer(userData.sales1.token);
      const response = await request(app)
        .post("/api/opportunities")
        .set("Authorization", `Bearer ${userData.sales1.token}`)
        .send({
          name: `${uniquePrefix}_Opportunity`,
          amount: 15000.0,
          stage: "NEED_ANALYSIS",
          customerId: customer.id,
          description: `${uniquePrefix} opportunity with customer`,
        });
      expect(response.statusCode).toBe(201);
      expect(response.body.status).toBe("success");
      expect(response.body.data.customerId).toBe(customer.id);
    });

    it("should create opportunity with leadId", async () => {
      const lead = await createLead(userData.sales1.token);
      const response = await request(app)
        .post("/api/opportunities")
        .set("Authorization", `Bearer ${userData.sales1.token}`)
        .send({
          name: `${uniquePrefix}_Opportunity`,
          amount: 20000.0,
          stage: "PROPOSAL_PRESENTATION",
          leadId: lead.id,
          description: `${uniquePrefix} opportunity from lead`,
        });
      expect(response.statusCode).toBe(201);
      expect(response.body.status).toBe("success");
      expect(response.body.data.leadId).toBe(lead.id);
    });

    it("should fail to create opportunity by VIEWER", async () => {
      const response = await request(app)
        .post("/api/opportunities")
        .set("Authorization", `Bearer ${userData.viewer.token}`)
        .send({
          name: `${uniquePrefix}_Opportunity`,
          amount: 10000.0,
          stage: "QUALIFICATION",
        });
      expect(response.statusCode).toBe(403);
    });

    it("should fail to create opportunity with invalid data", async () => {
      const response = await request(app)
        .post("/api/opportunities")
        .set("Authorization", `Bearer ${userData.sales1.token}`)
        .send({
          name: "",
          amount: -1000,
          stage: "INVALID_STAGE",
        });
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error");
    });

    it("should fail to create opportunity with invalid customer", async () => {
      const response = await request(app)
        .post("/api/opportunities")
        .set("Authorization", `Bearer ${userData.sales1.token}`)
        .send({
          name: `${uniquePrefix}_Opportunity`,
          amount: 10000.0,
          stage: "QUALIFICATION",
          customerId: 99999,
        });
      expect(response.statusCode).toBe(404);
      expect(response.body.status).toBe("error");
    });

    it("should fail to create opportunity with invalid lead", async () => {
      const response = await request(app)
        .post("/api/opportunities")
        .set("Authorization", `Bearer ${userData.sales1.token}`)
        .send({
          name: `${uniquePrefix}_Opportunity`,
          amount: 10000.0,
          stage: "QUALIFICATION",
          leadId: 99999,
        });
      expect(response.statusCode).toBe(404);
      expect(response.body.status).toBe("error");
    });
  });

  describe("GET /api/opportunities", () => {
    it("should get all opportunities for all roles", async () => {
      const response = await request(app)
        .get("/api/opportunities")
        .set("Authorization", `Bearer ${userData.viewer.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
    });

    it("should get opportunities with stage filter", async () => {
      const response = await request(app)
        .get("/api/opportunities?stage=QUALIFICATION")
        .set("Authorization", `Bearer ${userData.viewer.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
    });

    it("should get a opportunity by ID", async () => {
      const opportunity = await createOpportunity(userData.sales2.token);
      const response = await request(app)
        .get(`/api/opportunities/${opportunity.id}`)
        .set("Authorization", `Bearer ${userData.viewer.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data.id).toBe(opportunity.id);
    });

    it("should fail to get opportunity with invalid id", async () => {
      const response = await request(app)
        .get("/api/opportunities/99999")
        .set("Authorization", `Bearer ${userData.sales2.token}`);
      expect(response.statusCode).toBe(404);
      expect(response.body.status).toBe("error");
    });
  });

  describe("PATCH /api/opportunities/:id", () => {
    it("should update a opportunity", async () => {
      const opportunity = await createOpportunity(userData.sales1.token);
      expect(opportunity.name).toBe(`${uniquePrefix}_Opportunity`);
      const response = await request(app)
        .patch(`/api/opportunities/${opportunity.id}`)
        .set("Authorization", `Bearer ${userData.sales1.token}`)
        .send({
          name: `${uniquePrefix}_Opportunity_Updated`,
          stage: "NEED_ANALYSIS",
          amount: 15000,
          closeDate: new Date(),
        });
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data.name).toBe(
        `${uniquePrefix}_Opportunity_Updated`
      );
      expect(response.body.data.stage).toBe("NEED_ANALYSIS");
      expect(response.body.data.amount).toBe("15000.00");
      expect(response.body.data.closeDate).not.toEqual(opportunity.closeDate);
    });

    it("should fail to update opportunity with invalid id", async () => {
      const response = await request(app)
        .patch("/api/opportunities/99999")
        .set("Authorization", `Bearer ${userData.sales1.token}`)
        .send({
          name: `${uniquePrefix}_Opportunity_Updated`,
        });
      expect(response.statusCode).toBe(404);
      expect(response.body.status).toBe("error");
    });

    it("should update a opportunity by ADMIN", async () => {
      const opportunity = await createOpportunity(userData.sales1.token);
      expect(opportunity.name).toBe(`${uniquePrefix}_Opportunity`);
      const response = await request(app)
        .patch(`/api/opportunities/${opportunity.id}`)
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .send({
          name: `${uniquePrefix}_Opportunity_Updated_Admin`,
          stage: "WON",
        });
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data.name).toBe(
        `${uniquePrefix}_Opportunity_Updated_Admin`
      );
      expect(response.body.data.stage).toBe("WON");
    });

    it("should fail to update a non-owned opportunity", async () => {
      const opportunity = await createOpportunity(userData.sales1.token);
      expect(opportunity.createdByUserId).not.toBe(userData.sales2.id);
      const response = await request(app)
        .patch(`/api/opportunities/${opportunity.id}`)
        .set("Authorization", `Bearer ${userData.sales2.token}`)
        .send({
          name: `${uniquePrefix}_Opportunity_Updated`,
        });
      expect(response.statusCode).toBe(403);
      expect(response.body.status).toBe("error");
    });
  });

  describe("DELETE /api/opportunities/:id", () => {
    it("should delete a opportunity", async () => {
      const opportunity = await createOpportunity(userData.sales1.token);
      expect(opportunity.name).toBe(`${uniquePrefix}_Opportunity`);
      const response = await request(app)
        .delete(`/api/opportunities/${opportunity.id}`)
        .set("Authorization", `Bearer ${userData.sales1.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
    });

    it("should fail to delete opportunity with invalid id", async () => {
      const response = await request(app)
        .delete("/api/opportunities/99999")
        .set("Authorization", `Bearer ${userData.sales1.token}`);
      expect(response.statusCode).toBe(404);
      expect(response.body.status).toBe("error");
    });

    it("should delete a opportunity by ADMIN", async () => {
      const opportunity = await createOpportunity(userData.sales1.token);
      expect(opportunity.name).toBe(`${uniquePrefix}_Opportunity`);
      const response = await request(app)
        .delete(`/api/opportunities/${opportunity.id}`)
        .set("Authorization", `Bearer ${userData.admin.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
    });

    it("should fail to delete a non-owned opportunity", async () => {
      const opportunity = await createOpportunity(userData.sales1.token);
      expect(opportunity.createdByUserId).not.toBe(userData.sales2.id);
      const response = await request(app)
        .delete(`/api/opportunities/${opportunity.id}`)
        .set("Authorization", `Bearer ${userData.sales2.token}`);
      expect(response.statusCode).toBe(403);
      expect(response.body.status).toBe("error");
    });
  });

  describe("GET opportunity relations", () => {
    it("should get opportunity activities for admin and manager", async () => {
      const opportunity = await createOpportunity(userData.sales1.token);
      const response = await request(app)
        .get(`/api/opportunities/${opportunity.id}/activities`)
        .set("Authorization", `Bearer ${userData.admin.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data).toBeDefined();
    });

    it("should get opportunity notes for admin and manager", async () => {
      const opportunity = await createOpportunity(userData.sales1.token);
      const response = await request(app)
        .get(`/api/opportunities/${opportunity.id}/notes`)
        .set("Authorization", `Bearer ${userData.admin.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data).toBeDefined();
    });
  });

  afterAll(async () => {
    await cleanupData();
    await prisma.user.deleteMany({
      where: { email: { startsWith: "opp_" } },
    });
  });
});
