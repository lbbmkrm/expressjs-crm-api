import request from "supertest";
import app from "./../src/app.js";
import prisma from "./../src/repositories/prismaClient.js";
import {
  setupUsers,
  cleanupUsers,
  cleanupModels,
  createCustomer,
  createLead,
} from "./testHelpers.js";

describe("Lead Endpoints", () => {
  let uniquePrefix;
  let userData;

  beforeAll(async () => {
    await cleanupModels("lead_", ["lead", "customer"]);
    await cleanupUsers("cnt_");
    uniquePrefix = `ld_${Date.now()}`;
    userData = await setupUsers(uniquePrefix);
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
      const customer = await createCustomer(
        userData.sales1.token,
        uniquePrefix
      );
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
      const customer = await createCustomer(
        userData.sales1.token,
        uniquePrefix
      );
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
      const lead = await createLead(userData.sales2.token, uniquePrefix);
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
      const lead = await createLead(userData.sales1.token, uniquePrefix);
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
      const lead = await createLead(userData.sales1.token, uniquePrefix);
      expect(lead.customerId).toBe(null);
      const customer = await createCustomer(
        userData.sales1.token,
        uniquePrefix
      );
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
      const lead = await createLead(userData.sales1.token, uniquePrefix);
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
      const lead = await createLead(userData.sales1.token, uniquePrefix);
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
      const lead = await createLead(userData.sales1.token, uniquePrefix);
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
      const lead = await createLead(userData.sales1.token, uniquePrefix);
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
      const lead = await createLead(userData.sales1.token, uniquePrefix);
      expect(lead.name).toBe(`${uniquePrefix}_Lead`);
      const response = await request(app)
        .delete(`/api/leads/${lead.id}`)
        .set("Authorization", `Bearer ${userData.admin.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
    });

    it("should fail to delete a non-owned lead", async () => {
      const lead = await createLead(userData.sales1.token, uniquePrefix);
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
      const lead = await createLead(userData.sales1.token, uniquePrefix);
      const response = await request(app)
        .get(`/api/leads/${lead.id}/activities`)
        .set("Authorization", `Bearer ${userData.manager.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data).toBeDefined();
    });

    it("should get lead notes for admin and manager", async () => {
      const lead = await createLead(userData.sales1.token, uniquePrefix);
      const response = await request(app)
        .get(`/api/leads/${lead.id}/notes`)
        .set("Authorization", `Bearer ${userData.manager.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data).toBeDefined();
    });

    it("should get lead opportunities (all roles)", async () => {
      const lead = await createLead(userData.sales1.token, uniquePrefix);
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
      const lead = await createLead(userData.sales1.token, uniquePrefix);

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
      const lead = await createLead(userData.sales1.token, uniquePrefix);

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
      const lead = await createLead(userData.sales1.token, uniquePrefix);

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
      const lead = await createLead(userData.sales1.token, uniquePrefix);

      const response = await request(app)
        .post(`/api/leads/${lead.id}/convert`)
        .set("Authorization", `Bearer ${userData.sales2.token}`);

      expect(response.statusCode).toBe(403);
      expect(response.body.status).toBe("error");
    });
  });
});
