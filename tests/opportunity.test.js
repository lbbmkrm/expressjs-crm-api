import request from "supertest";
import app from "./../src/app.js";
import {
  setupUsers,
  cleanupUsers,
  cleanupModels,
  createCustomer,
  createLead,
  createOpportunity,
} from "./testHelpers.js";

describe("Opportunity Endpoints", () => {
  let uniquePrefix;
  let userData;

  beforeAll(async () => {
    await cleanupModels("opportunity_", ["opportunity", "lead", "customer"]);
    await cleanupUsers("opp_");
    uniquePrefix = `opp_${Date.now()}`;
    userData = await setupUsers(uniquePrefix);
  });

  beforeEach(() => {
    uniquePrefix = `opportunity_${Date.now()}`;
  });

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
      const customer = await createCustomer(
        userData.sales1.token,
        uniquePrefix
      );
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
      const lead = await createLead(userData.sales1.token, uniquePrefix);
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
      const opportunity = await createOpportunity(
        userData.sales2.token,
        uniquePrefix
      );
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
      const opportunity = await createOpportunity(
        userData.sales1.token,
        uniquePrefix
      );
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
      const opportunity = await createOpportunity(
        userData.sales1.token,
        uniquePrefix
      );
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
      const opportunity = await createOpportunity(
        userData.sales1.token,
        uniquePrefix
      );
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
      const opportunity = await createOpportunity(
        userData.sales1.token,
        uniquePrefix
      );
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
      const opportunity = await createOpportunity(
        userData.sales1.token,
        uniquePrefix
      );
      expect(opportunity.name).toBe(`${uniquePrefix}_Opportunity`);
      const response = await request(app)
        .delete(`/api/opportunities/${opportunity.id}`)
        .set("Authorization", `Bearer ${userData.admin.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
    });

    it("should fail to delete a non-owned opportunity", async () => {
      const opportunity = await createOpportunity(
        userData.sales1.token,
        uniquePrefix
      );
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
      const opportunity = await createOpportunity(
        userData.sales1.token,
        uniquePrefix
      );
      const response = await request(app)
        .get(`/api/opportunities/${opportunity.id}/activities`)
        .set("Authorization", `Bearer ${userData.admin.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data).toBeDefined();
    });

    it("should get opportunity notes for admin and manager", async () => {
      const opportunity = await createOpportunity(
        userData.sales1.token,
        uniquePrefix
      );
      const response = await request(app)
        .get(`/api/opportunities/${opportunity.id}/notes`)
        .set("Authorization", `Bearer ${userData.admin.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data).toBeDefined();
    });
  });
});
