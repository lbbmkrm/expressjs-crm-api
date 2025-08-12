import request from "supertest";
import app from "../src/app.js";
import prisma from "../src/repositories/prismaClient.js";

describe("Note Endpoints", () => {
  let uniquePrefix;
  const cleanupData = async () => {
    await prisma.note.deleteMany({
      where: {
        content: {
          startsWith: "note_",
        },
      },
    });
    await prisma.opportunity.deleteMany({
      where: {
        name: { startsWith: "note_" },
      },
    });
    await prisma.lead.deleteMany({
      where: {
        name: { startsWith: "note_" },
      },
    });
    await prisma.contact.deleteMany({
      where: {
        firstName: { startsWith: "note_" },
      },
    });
    await prisma.customer.deleteMany({
      where: {
        name: { startsWith: "note_" },
      },
    });
    await prisma.user.deleteMany({
      where: {
        username: { startsWith: "nt_" },
      },
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
    uniquePrefix = `nt_${Date.now()}`;
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
    uniquePrefix = `note_${Date.now()}`;
  });
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
  const createContact = async (token, customerId, position = null) => {
    const response = await request(app)
      .post("/api/contacts")
      .set("Authorization", `Bearer ${token}`)
      .send({
        customerId: customerId,
        firstName: `${uniquePrefix}_First`,
        lastName: `${uniquePrefix}_Last`,
        email: `${uniquePrefix}_cont@example.com`,
        phone: "1234567890",
        position: position,
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
  const createNote = async (
    token,
    customerId = null,
    contactId = null,
    leadId = null,
    opportunityId = null
  ) => {
    const noteData = {
      content: `${uniquePrefix}_Note`,
    };
    if (customerId) {
      noteData.customerId = customerId;
    }
    if (contactId) {
      noteData.contactId = contactId;
    }
    if (leadId) {
      noteData.leadId = leadId;
    }
    if (opportunityId) {
      noteData.opportunityId = opportunityId;
    }
    const response = await request(app)
      .post("/api/notes")
      .set("Authorization", `Bearer ${token}`)
      .send(noteData);
    return response.body.data;
  };

  describe("POST /api/notes", () => {
    it("should create a note with one relation id (customerId) to all roles", async () => {
      const customer = await createCustomer(userData.sales2.token);
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
      const customer = await createCustomer(userData.sales2.token);
      const contact = await createContact(userData.sales2.token, customer.id);
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
      const lead = await createLead(userData.sales2.token);
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
      const opportunity = await createOpportunity(userData.sales2.token);
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
      const customer = await createCustomer(userData.sales2.token);
      expect(customer.id).not.toBeNull();
      const lead = await createLead(userData.sales1.token);
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
      const customer = await createCustomer(userData.sales2.token);
      const note = await createNote(userData.viewer.token, customer.id);
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
      const customer = await createCustomer(userData.sales2.token);
      const note = await createNote(userData.sales2.token, customer.id);
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
      const customer = await createCustomer(userData.sales2.token);
      const note = await createNote(userData.sales2.token, customer.id);
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
      const customer = await createCustomer(userData.sales2.token);
      const note = await createNote(userData.manager.token, customer.id);
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
      const customer = await createCustomer(userData.sales2.token);
      const note = await createNote(userData.sales2.token, customer.id);
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
      const customer = await createCustomer(userData.sales2.token);
      const note = await createNote(userData.viewer.token, customer.id);
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
      const customer = await createCustomer(userData.sales2.token);
      const note = await createNote(userData.sales2.token, customer.id);
      const response = await request(app)
        .delete(`/api/notes/${note.id}`)
        .set("Authorization", `Bearer ${userData.sales1.token}`);
      expect(response.statusCode).toBe(403);
      expect(response.body.status).toBe("error");
    });
    it("should delete a note by admin", async () => {
      const customer = await createCustomer(userData.sales2.token);
      const note = await createNote(userData.sales2.token, customer.id);
      const response = await request(app)
        .delete(`/api/notes/${note.id}`)
        .set("Authorization", `Bearer ${userData.admin.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
    });
  });
});
