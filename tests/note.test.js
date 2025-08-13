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
  createNote,
} from "./testHelpers.js";

describe("Note Endpoints", () => {
  let uniquePrefix;
  let userData;

  beforeAll(async () => {
    await cleanupModels("note_", [
      "note",
      "opportunity",
      "lead",
      "contact",
      "customer",
    ]);
    await cleanupUsers("nt_");
    uniquePrefix = `nt_${Date.now()}`;
    userData = await setupUsers(uniquePrefix);
  });

  beforeEach(async () => {
    uniquePrefix = `note_${Date.now()}`;
  });

  describe("POST /api/notes", () => {
    it("should create a note with one relation id (customerId) to all roles", async () => {
      const customer = await createCustomer(
        userData.sales2.token,
        uniquePrefix
      );
      expect(customer.id).not.toBeNull();
      const response = await request(app)
        .post("/api/notes")
        .set("Authorization", `Bearer ${userData.viewer.token}`)
        .send({
          content: `${uniquePrefix}_Note`,
          customerId: customer.id,
        });
      expect(response.statusCode).toBe(201);
      expect(response.body.status).toBe("success");
    });

    it("should create a note with one relation id (contactId) to all roles", async () => {
      const customer = await createCustomer(
        userData.sales2.token,
        uniquePrefix
      );
      const contact = await createContact(
        userData.sales2.token,
        uniquePrefix,
        customer.id
      );
      expect(contact.id).not.toBeNull();
      const response = await request(app)
        .post("/api/notes")
        .set("Authorization", `Bearer ${userData.viewer.token}`)
        .send({
          content: `${uniquePrefix}_Note`,
          contactId: contact.id,
        });
      expect(response.statusCode).toBe(201);
      expect(response.body.status).toBe("success");
    });

    it("should create a note with one relation id (leadId) to all roles", async () => {
      const lead = await createLead(userData.sales2.token, uniquePrefix);
      expect(lead.id).not.toBeNull();
      const response = await request(app)
        .post("/api/notes")
        .set("Authorization", `Bearer ${userData.viewer.token}`)
        .send({
          content: `${uniquePrefix}_Note`,
          leadId: lead.id,
        });
      expect(response.statusCode).toBe(201);
      expect(response.body.status).toBe("success");
    });

    it("should create a note with one relation id (opportunityId) to all roles", async () => {
      const opportunity = await createOpportunity(
        userData.sales2.token,
        uniquePrefix
      );
      expect(opportunity.id).not.toBeNull();
      const response = await request(app)
        .post("/api/notes")
        .set("Authorization", `Bearer ${userData.viewer.token}`)
        .send({
          content: `${uniquePrefix}_Note`,
          opportunityId: opportunity.id,
        });
      expect(response.statusCode).toBe(201);
      expect(response.body.status).toBe("success");
    });
    it("should fail to create note with more than one relation id", async () => {
      const customer = await createCustomer(
        userData.sales2.token,
        uniquePrefix
      );
      expect(customer.id).not.toBeNull();
      const lead = await createLead(userData.sales1.token, uniquePrefix);
      expect(lead.id).not.toBeNull();
      const response = await request(app)
        .post("/api/notes")
        .set("Authorization", `Bearer ${userData.viewer.token}`)
        .send({
          content: `${uniquePrefix}_Note`,
          customerId: customer.id,
          leadId: lead.id,
        });
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error");
    });
    it("should fail to create note with no relation id", async () => {
      const response = await request(app)
        .post("/api/notes")
        .set("Authorization", `Bearer ${userData.viewer.token}`)
        .send({
          content: `${uniquePrefix}_Note`,
        });
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error");
    });
    it("should fail to create note with invalid customer id", async () => {
      const response = await request(app)
        .post("/api/notes")
        .set("Authorization", `Bearer ${userData.viewer.token}`)
        .send({
          content: `${uniquePrefix}_Note`,
          customerId: "invalid",
        });
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error");
    });
    it("should fail to create note with invalid contact id", async () => {
      const response = await request(app)
        .post("/api/notes")
        .set("Authorization", `Bearer ${userData.viewer.token}`)
        .send({
          content: `${uniquePrefix}_Note`,
          contactId: "invalid",
        });
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error");
    });
    it("should fail to create note with invalid lead id", async () => {
      const response = await request(app)
        .post("/api/notes")
        .set("Authorization", `Bearer ${userData.viewer.token}`)
        .send({
          content: `${uniquePrefix}_Note`,
          leadId: "invalid",
        });
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error");
    });
    it("should fail to create note with invalid opportunity id", async () => {
      const response = await request(app)
        .post("/api/notes")
        .set("Authorization", `Bearer ${userData.viewer.token}`)
        .send({
          content: `${uniquePrefix}_Note`,
          opportunityId: "invalid",
        });
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error");
    });
  });
  describe("GET /api/notes", () => {
    it("should get all notes (only admin and manager)", async () => {
      const response = await request(app)
        .get("/api/notes")
        .set("Authorization", `Bearer ${userData.manager.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
    });
    it("should fail to get all notes (only admin and manager)", async () => {
      const response = await request(app)
        .get("/api/notes")
        .set("Authorization", `Bearer ${userData.sales1.token}`);
      expect(response.statusCode).toBe(403);
      expect(response.body.status).toBe("error");
    });
    it("should get a note by id for admin, manager and owner", async () => {
      const customer = await createCustomer(
        userData.sales2.token,
        uniquePrefix
      );
      const note = await createNote(
        userData.viewer.token,
        uniquePrefix,
        customer.id
      );
      expect(note.id).not.toBeNull();
      const response = await request(app)
        .get(`/api/notes/${note.id}`)
        .set("Authorization", `Bearer ${userData.viewer.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
    });
    it("should fail to get note with invalid id", async () => {
      const response = await request(app)
        .get(`/api/notes/invalid`)
        .set("Authorization", `Bearer ${userData.admin.token}`);
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error");
    });
    it("should fail to get note for non-owner", async () => {
      const customer = await createCustomer(
        userData.sales2.token,
        uniquePrefix
      );
      const note = await createNote(
        userData.sales2.token,
        uniquePrefix,
        customer.id
      );
      const response = await request(app)
        .get(`/api/notes/${note.id}`)
        .set("Authorization", `Bearer ${userData.sales1.token}`);
      expect(response.statusCode).toBe(403);
      expect(response.body.status).toBe("error");
    });
    it("should get my notes", async () => {
      const response = await request(app)
        .get("/api/notes/my-notes")
        .set("Authorization", `Bearer ${userData.sales1.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
    });
  });
  describe("PATCH /api/notes/:id", () => {
    it("should update a note for admin and owner", async () => {
      const customer = await createCustomer(
        userData.sales2.token,
        uniquePrefix
      );
      const note = await createNote(
        userData.sales2.token,
        uniquePrefix,
        customer.id
      );
      const response = await request(app)
        .patch(`/api/notes/${note.id}`)
        .set("Authorization", `Bearer ${userData.sales2.token}`)
        .send({
          content: `${uniquePrefix}_Updated_Note`,
        });
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data.content).toBe(`${uniquePrefix}_Updated_Note`);
    });
    it("should fail to update note with invalid id", async () => {
      const response = await request(app)
        .patch(`/api/notes/999`)
        .set("Authorization", `Bearer ${userData.sales2.token}`)
        .send({
          content: `${uniquePrefix}_Updated_Note`,
        });
      expect(response.statusCode).toBe(404);
      expect(response.body.status).toBe("error");
    });
    it("should fail to update non owner note", async () => {
      const customer = await createCustomer(
        userData.sales2.token,
        uniquePrefix
      );
      const note = await createNote(
        userData.manager.token,
        uniquePrefix,
        customer.id
      );
      const response = await request(app)
        .patch(`/api/notes/${note.id}`)
        .set("Authorization", `Bearer ${userData.sales1.token}`)
        .send({
          content: `${uniquePrefix}_Updated_Note`,
        });
      expect(response.statusCode).toBe(403);
      expect(response.body.status).toBe("error");
    });
    it("should update a note by admin", async () => {
      const customer = await createCustomer(
        userData.sales2.token,
        uniquePrefix
      );
      const note = await createNote(
        userData.sales2.token,
        uniquePrefix,
        customer.id
      );
      const response = await request(app)
        .patch(`/api/notes/${note.id}`)
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .send({
          content: `${uniquePrefix}_Updated_Note`,
        });
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data.content).toBe(`${uniquePrefix}_Updated_Note`);
    });
  });
  describe("DELETE /api/notes/:id", () => {
    it("should delete a note for admin and owner", async () => {
      const customer = await createCustomer(
        userData.sales2.token,
        uniquePrefix
      );
      const note = await createNote(
        userData.viewer.token,
        uniquePrefix,
        customer.id
      );
      const response = await request(app)
        .delete(`/api/notes/${note.id}`)
        .set("Authorization", `Bearer ${userData.viewer.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
    });
    it("should fail to delete note with invalid id", async () => {
      const response = await request(app)
        .delete(`/api/notes/999`)
        .set("Authorization", `Bearer ${userData.sales2.token}`);
      expect(response.statusCode).toBe(404);
      expect(response.body.status).toBe("error");
    });
    it("should fail to delete non owner note", async () => {
      const customer = await createCustomer(
        userData.sales2.token,
        uniquePrefix
      );
      const note = await createNote(
        userData.sales2.token,
        uniquePrefix,
        customer.id
      );
      const response = await request(app)
        .delete(`/api/notes/${note.id}`)
        .set("Authorization", `Bearer ${userData.sales1.token}`);
      expect(response.statusCode).toBe(403);
      expect(response.body.status).toBe("error");
    });
    it("should delete a note by admin", async () => {
      const customer = await createCustomer(
        userData.sales2.token,
        uniquePrefix
      );
      const note = await createNote(
        userData.sales2.token,
        uniquePrefix,
        customer.id
      );
      const response = await request(app)
        .delete(`/api/notes/${note.id}`)
        .set("Authorization", `Bearer ${userData.admin.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
    });
  });
});
