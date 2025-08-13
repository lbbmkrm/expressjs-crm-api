import request from "supertest";
import app from "../src/app.js";
import {
  setupUsers,
  cleanupUsers,
  cleanupModels,
  createCustomer,
  createContact,
  createLead,
  createOpportunity,
  createActivity,
} from "./testHelpers.js";

describe("Activity Endpoints", () => {
  let uniquePrefix;
  let userData;

  beforeAll(async () => {
    await cleanupModels("activity_", [
      "activity",
      "opportunity",
      "lead",
      "contact",
      "customer",
    ]);
    await cleanupUsers("act_");
    uniquePrefix = `act_${Date.now()}`;
    userData = await setupUsers(uniquePrefix);
  });

  beforeEach(async () => {
    uniquePrefix = `activity_${Date.now()}`;
  });

  describe("POST /api/activities", () => {
    it("should create an activity with customerId (all roles)", async () => {
      const customer = await createCustomer(
        userData.sales2.token,
        uniquePrefix
      );
      const response = await request(app)
        .post("/api/activities")
        .set("Authorization", `Bearer ${userData.viewer.token}`)
        .send({
          type: "NOTE",
          subject: `${uniquePrefix}_Activity`,
          content: `${uniquePrefix}_Activity_Content`,
          customerId: customer.id,
        });
      expect(response.statusCode).toBe(201);
      expect(response.body.status).toBe("success");
    });

    it("should create an activity with contactId (all roles)", async () => {
      const customer = await createCustomer(
        userData.sales2.token,
        uniquePrefix
      );
      const contact = await createContact(
        userData.sales2.token,
        uniquePrefix,
        customer.id
      );
      const response = await request(app)
        .post("/api/activities")
        .set("Authorization", `Bearer ${userData.viewer.token}`)
        .send({
          type: "CALL",
          subject: `${uniquePrefix}_Activity`,
          content: `${uniquePrefix}_Activity_Content`,
          contactId: contact.id,
        });
      expect(response.statusCode).toBe(201);
      expect(response.body.status).toBe("success");
    });

    it("should create an activity with leadId (all roles)", async () => {
      const lead = await createLead(userData.sales2.token, uniquePrefix);
      const response = await request(app)
        .post("/api/activities")
        .set("Authorization", `Bearer ${userData.viewer.token}`)
        .send({
          type: "EMAIL",
          subject: `${uniquePrefix}_Activity`,
          content: `${uniquePrefix}_Activity_Content`,
          leadId: lead.id,
        });
      expect(response.statusCode).toBe(201);
      expect(response.body.status).toBe("success");
    });

    it("should create an activity with opportunityId (all roles)", async () => {
      const opportunity = await createOpportunity(
        userData.sales2.token,
        uniquePrefix
      );
      const response = await request(app)
        .post("/api/activities")
        .set("Authorization", `Bearer ${userData.viewer.token}`)
        .send({
          type: "MEETING",
          subject: `${uniquePrefix}_Activity`,
          content: `${uniquePrefix}_Activity_Content`,
          opportunityId: opportunity.id,
        });
      expect(response.statusCode).toBe(201);
      expect(response.body.status).toBe("success");
    });

    it("should fail to create activity with more than one relation id", async () => {
      const customer = await createCustomer(
        userData.sales2.token,
        uniquePrefix
      );
      const lead = await createLead(userData.sales2.token, uniquePrefix);
      const response = await request(app)
        .post("/api/activities")
        .set("Authorization", `Bearer ${userData.viewer.token}`)
        .send({
          type: "NOTE",
          subject: `${uniquePrefix}_Activity`,
          content: `${uniquePrefix}_Activity_Content`,
          customerId: customer.id,
          leadId: lead.id,
        });
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error");
    });

    it("should fail to create activity with no relation id", async () => {
      const response = await request(app)
        .post("/api/activities")
        .set("Authorization", `Bearer ${userData.viewer.token}`)
        .send({
          type: "NOTE",
          subject: `${uniquePrefix}_Activity`,
          content: `${uniquePrefix}_Activity_Content`,
        });
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error");
    });

    it("should fail to create activity with invalid type", async () => {
      const customer = await createCustomer(
        userData.sales2.token,
        uniquePrefix
      );
      const response = await request(app)
        .post("/api/activities")
        .set("Authorization", `Bearer ${userData.viewer.token}`)
        .send({
          type: "INVALID_TYPE",
          subject: `${uniquePrefix}_Activity`,
          content: `${uniquePrefix}_Activity_Content`,
          customerId: customer.id,
        });
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error");
    });

    it("should fail to create activity with invalid customerId", async () => {
      const response = await request(app)
        .post("/api/activities")
        .set("Authorization", `Bearer ${userData.viewer.token}`)
        .send({
          type: "NOTE",
          subject: `${uniquePrefix}_Activity`,
          content: `${uniquePrefix}_Activity_Content`,
          customerId: 99999,
        });
      expect(response.statusCode).toBe(404);
      expect(response.body.status).toBe("error");
    });
    it("should fail to create activity with invalid contactId", async () => {
      const response = await request(app)
        .post("/api/activities")
        .set("Authorization", `Bearer ${userData.viewer.token}`)
        .send({
          type: "NOTE",
          subject: `${uniquePrefix}_Activity`,
          content: `${uniquePrefix}_Activity_Content`,
          contactId: 99999,
        });
      expect(response.statusCode).toBe(404);
      expect(response.body.status).toBe("error");
    });
    it("should fail to create activity with invalid leadId", async () => {
      const response = await request(app)
        .post("/api/activities")
        .set("Authorization", `Bearer ${userData.viewer.token}`)
        .send({
          type: "NOTE",
          subject: `${uniquePrefix}_Activity`,
          content: `${uniquePrefix}_Activity_Content`,
          leadId: 99999,
        });
      expect(response.statusCode).toBe(404);
      expect(response.body.status).toBe("error");
    });
    it("should fail to create activity with invalid opportunityId", async () => {
      const response = await request(app)
        .post("/api/activities")
        .set("Authorization", `Bearer ${userData.viewer.token}`)
        .send({
          type: "NOTE",
          subject: `${uniquePrefix}_Activity`,
          content: `${uniquePrefix}_Activity_Content`,
          opportunityId: 99999,
        });
      expect(response.statusCode).toBe(404);
      expect(response.body.status).toBe("error");
    });
  });

  describe("GET /api/activities", () => {
    it("should get all activities (only admin and manager)", async () => {
      const response = await request(app)
        .get("/api/activities")
        .set("Authorization", `Bearer ${userData.manager.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
    });

    it("should fail to get all activities non authorized user", async () => {
      const response = await request(app)
        .get("/api/activities")
        .set("Authorization", `Bearer ${userData.sales1.token}`);
      expect(response.statusCode).toBe(403);
      expect(response.body.status).toBe("error");
    });

    it("should get activities filtered by type", async () => {
      const response = await request(app)
        .get("/api/activities?type=NOTE")
        .set("Authorization", `Bearer ${userData.manager.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
    });
    it("should get an activity by id for admin, manager and owner", async () => {
      const customer = await createCustomer(
        userData.sales2.token,
        uniquePrefix
      );
      const createRes = await request(app)
        .post("/api/activities")
        .set("Authorization", `Bearer ${userData.viewer.token}`)
        .send({
          type: "NOTE",
          subject: `${uniquePrefix}_Activity`,
          content: `${uniquePrefix}_Activity_Content`,
          customerId: customer.id,
        });
      const activity = createRes.body.data;
      const response = await request(app)
        .get(`/api/activities/${activity.id}`)
        .set("Authorization", `Bearer ${userData.viewer.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data.id).toBe(activity.id);
    });

    it("should fail to get activity with invalid id param type", async () => {
      const response = await request(app)
        .get("/api/activities/invalid")
        .set("Authorization", `Bearer ${userData.admin.token}`);
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error");
    });

    it("should fail to get activity with invalid id", async () => {
      const response = await request(app)
        .get("/api/activities/999999")
        .set("Authorization", `Bearer ${userData.admin.token}`);
      expect(response.statusCode).toBe(404);
      expect(response.body.status).toBe("error");
    });

    it("should fail to get activity for non-owner user", async () => {
      const lead = await createLead(userData.sales2.token, uniquePrefix);
      const activity = await createActivity(
        userData.sales1.token,
        uniquePrefix,
        null,
        null,
        lead.id
      );
      const response = await request(app)
        .get(`/api/activities/${activity.id}`)
        .set("Authorization", `Bearer ${userData.sales2.token}`);
      expect(response.statusCode).toBe(403);
      expect(response.body.status).toBe("error");
    });
    it("should get my activities", async () => {
      const response = await request(app)
        .get("/api/activities/my-activities")
        .set("Authorization", `Bearer ${userData.sales1.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
    });
  });
  describe("PATCH /api/activities/:id", () => {
    it("should update an activity for owner", async () => {
      const customer = await createCustomer(
        userData.sales1.token,
        uniquePrefix
      );
      const activity = await createActivity(
        userData.sales2.token,
        uniquePrefix,
        customer.id
      );
      const response = await request(app)
        .patch(`/api/activities/${activity.id}`)
        .set("Authorization", `Bearer ${userData.sales2.token}`)
        .send({
          subject: `${uniquePrefix}_Updated_Subject`,
          content: `${uniquePrefix}_Updated_Content`,
          type: "CALL",
        });
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data.subject).toBe(
        `${uniquePrefix}_Updated_Subject`
      );
      expect(response.body.data.type).toBe("CALL");
    });

    it("should fail to update activity with invalid id", async () => {
      const response = await request(app)
        .patch("/api/activities/999999")
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .send({ subject: `${uniquePrefix}_Updated_Subject` });
      expect(response.statusCode).toBe(404);
      expect(response.body.status).toBe("error");
    });

    it("should fail to update activity by non-owner", async () => {
      const customer = await createCustomer(
        userData.sales1.token,
        uniquePrefix
      );
      const activity = await createActivity(
        userData.manager.token,
        uniquePrefix,
        customer.id
      );
      const response = await request(app)
        .patch(`/api/activities/${activity.id}`)
        .set("Authorization", `Bearer ${userData.sales1.token}`)
        .send({ subject: `${uniquePrefix}_Updated_Subject` });
      expect(response.statusCode).toBe(403);
      expect(response.body.status).toBe("error");
    });

    it("should update an activity by admin", async () => {
      const lead = await createLead(userData.sales2.token, uniquePrefix);
      const activity = await createActivity(
        userData.manager.token,
        uniquePrefix,
        null,
        null,
        lead.id
      );
      const response = await request(app)
        .patch(`/api/activities/${activity.id}`)
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .send({ subject: `${uniquePrefix}_Updated_By_Admin` });
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data.subject).toBe(
        `${uniquePrefix}_Updated_By_Admin`
      );
    });
  });

  describe("DELETE /api/activities/:id", () => {
    it("should delete an activity for owner", async () => {
      const customer = await createCustomer(
        userData.sales2.token,
        uniquePrefix
      );
      const activity = await createActivity(
        userData.sales2.token,
        uniquePrefix,
        customer.id
      );
      const response = await request(app)
        .delete(`/api/activities/${activity.id}`)
        .set("Authorization", `Bearer ${userData.sales2.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
    });

    it("should fail to delete activity with non-existent id", async () => {
      const response = await request(app)
        .delete("/api/activities/999999")
        .set("Authorization", `Bearer ${userData.admin.token}`);
      expect(response.statusCode).toBe(404);
      expect(response.body.status).toBe("error");
    });

    it("should fail to delete activity by non-owner", async () => {
      const customer = await createCustomer(
        userData.sales1.token,
        uniquePrefix
      );
      const activity = await createActivity(
        userData.manager.token,
        uniquePrefix,
        customer.id
      );
      const response = await request(app)
        .delete(`/api/activities/${activity.id}`)
        .set("Authorization", `Bearer ${userData.sales1.token}`);
      expect(response.statusCode).toBe(403);
      expect(response.body.status).toBe("error");
    });

    it("should delete an activity by admin", async () => {
      const customer = await createCustomer(
        userData.sales2.token,
        uniquePrefix
      );
      const activity = await createActivity(
        userData.manager.token,
        uniquePrefix,
        customer.id
      );
      const response = await request(app)
        .delete(`/api/activities/${activity.id}`)
        .set("Authorization", `Bearer ${userData.admin.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
    });
  });
});
