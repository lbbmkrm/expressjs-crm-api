import request from "supertest";
import app from "./../src/app.js";
import prisma from "./../src/repositories/prismaClient.js";

describe("Contact Endpoints", () => {
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
    await prisma.contact.deleteMany({
      where: { firstName: { startsWith: "contact_" } },
    });
    await prisma.customer.deleteMany({
      where: { name: { startsWith: "contact_" } },
    });
    await prisma.user.deleteMany({
      where: { email: { startsWith: "cnct_" } },
    });
    uniquePrefix = `cnct_${Date.now()}`;
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
    uniquePrefix = `contact_${Date.now()}`;
  });

  afterEach(async () => {
    await prisma.contact.deleteMany({
      where: { firstName: { startsWith: "contact_" } },
    });
    await prisma.customer.deleteMany({
      where: { name: { startsWith: "contact_" } },
    });
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

  const createContact = async (token) => {
    const customer = await createCustomer(token);
    const response = await request(app)
      .post("/api/contacts")
      .set("Authorization", `Bearer ${token}`)
      .send({
        customerId: customer.id,
        firstName: `${uniquePrefix}_First`,
        lastName: `${uniquePrefix}_Last`,
        email: `${uniquePrefix}_cont@example.com`,
        phone: "1234567890",
        position: "Manager",
      });
    return response.body.data;
  };

  describe("POST /api/contacts", () => {
    it("should create a new contact", async () => {
      const customer = await createCustomer(userData.sales1.token);
      const response = await request(app)
        .post("/api/contacts")
        .set("Authorization", `Bearer ${userData.sales1.token}`)
        .send({
          customerId: customer.id,
          firstName: `${uniquePrefix}_First`,
          lastName: `${uniquePrefix}_Last`,
          email: `${uniquePrefix}_cont@example.com`,
          phone: "1234567890",
          position: "Manager",
        });
      expect(response.statusCode).toBe(201);
      expect(response.body.status).toBe("success");
    });

    it("should fail to create contact by VIEWER", async () => {
      const customer = await createCustomer(userData.sales1.token);
      const response = await request(app)
        .post("/api/contacts")
        .set("Authorization", `Bearer ${userData.viewer.token}`)
        .send({
          customerId: customer.id,
          firstName: `${uniquePrefix}_First`,
          lastName: `${uniquePrefix}_Last`,
          email: `${uniquePrefix}_cont@example.com`,
          phone: "1234567890",
          position: "Manager",
        });
      expect(response.statusCode).toBe(403);
    });

    it("should fail to create contact with duplicate email", async () => {
      const customer = await createCustomer(userData.sales1.token);
      const email = `${uniquePrefix}_cont@example.com`;
      const response1 = await request(app)
        .post("/api/contacts")
        .set("Authorization", `Bearer ${userData.sales1.token}`)
        .send({
          customerId: customer.id,
          firstName: `${uniquePrefix}_First`,
          lastName: `${uniquePrefix}_Last`,
          email,
          phone: "1234567890",
          position: "Manager",
        });
      expect(response1.statusCode).toBe(201);
      const response2 = await request(app)
        .post("/api/contacts")
        .set("Authorization", `Bearer ${userData.sales1.token}`)
        .send({
          customerId: customer.id,
          firstName: `${uniquePrefix}_First2`,
          lastName: `${uniquePrefix}_Last2`,
          email,
          phone: "1234567890",
          position: "Manager2",
        });
      expect(response2.statusCode).toBe(400);
      expect(response2.body.status).toBe("error");
    });

    it("should fail to create contact with invalid data", async () => {
      const customer = await createCustomer(userData.sales1.token);
      const response = await request(app)
        .post("/api/contacts")
        .set("Authorization", `Bearer ${userData.sales1.token}`)
        .send({
          customerId: customer.id,
          firstName: "",
          email: "invalid-email",
          phone: "",
        });
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error");
    });
  });

  describe("GET /api/contacts", () => {
    it("should get all contacts for all roles", async () => {
      const response = await request(app)
        .get("/api/contacts")
        .set("Authorization", `Bearer ${userData.sales1.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
    });

    it("should get a contact by ID", async () => {
      const contact = await createContact(userData.sales2.token);
      const response = await request(app)
        .get(`/api/contacts/${contact.id}`)
        .set("Authorization", `Bearer ${userData.sales2.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data.id).toBe(contact.id);
    });

    it("should fail to get contact with invalid id", async () => {
      const response = await request(app)
        .get("/api/contacts/99999")
        .set("Authorization", `Bearer ${userData.sales2.token}`);
      expect(response.statusCode).toBe(404);
      expect(response.body.status).toBe("error");
    });
  });

  describe("PATCH /api/contacts/:id", () => {
    it("should update a contact", async () => {
      const contact = await createContact(userData.sales1.token);
      expect(contact.firstName).toBe(`${uniquePrefix}_First`);
      const response = await request(app)
        .patch(`/api/contacts/${contact.id}`)
        .set("Authorization", `Bearer ${userData.sales1.token}`)
        .send({
          firstName: `${uniquePrefix}_First_Updated`,
        });
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data.firstName).toBe(
        `${uniquePrefix}_First_Updated`
      );
    });

    it("should fail to update contact with invalid id", async () => {
      const response = await request(app)
        .patch("/api/contacts/99999")
        .set("Authorization", `Bearer ${userData.sales1.token}`)
        .send({
          firstName: `${uniquePrefix}_First_Updated`,
        });
      expect(response.statusCode).toBe(404);
      expect(response.body.status).toBe("error");
    });

    it("should update a contact by ADMIN", async () => {
      const contact = await createContact(userData.sales1.token);
      expect(contact.firstName).toBe(`${uniquePrefix}_First`);
      const response = await request(app)
        .patch(`/api/contacts/${contact.id}`)
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .send({
          firstName: `${uniquePrefix}_First_Updated`,
        });
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data.firstName).toBe(
        `${uniquePrefix}_First_Updated`
      );
    });

    it("should fail to update a non-owned contact", async () => {
      const contact = await createContact(userData.sales1.token);
      expect(contact.createdByUserId).not.toBe(userData.sales2.id);
      const response = await request(app)
        .patch(`/api/contacts/${contact.id}`)
        .set("Authorization", `Bearer ${userData.sales2.token}`)
        .send({
          firstName: `${uniquePrefix}_First_Updated`,
        });
      expect(response.statusCode).toBe(403);
      expect(response.body.status).toBe("error");
    });
  });

  describe("DELETE /api/contacts/:id", () => {
    it("should delete a contact", async () => {
      const contact = await createContact(userData.sales1.token);
      expect(contact.firstName).toBe(`${uniquePrefix}_First`);
      const response = await request(app)
        .delete(`/api/contacts/${contact.id}`)
        .set("Authorization", `Bearer ${userData.sales1.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
    });

    it("should fail to delete contact with invalid id", async () => {
      const response = await request(app)
        .delete("/api/contacts/99999")
        .set("Authorization", `Bearer ${userData.sales1.token}`);
      expect(response.statusCode).toBe(404);
      expect(response.body.status).toBe("error");
    });

    it("should delete a contact by ADMIN", async () => {
      const contact = await createContact(userData.sales1.token);
      expect(contact.firstName).toBe(`${uniquePrefix}_First`);
      const response = await request(app)
        .delete(`/api/contacts/${contact.id}`)
        .set("Authorization", `Bearer ${userData.admin.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
    });

    it("should fail to delete a non-owned contact", async () => {
      const contact = await createContact(userData.sales1.token);
      expect(contact.createdByUserId).not.toBe(userData.sales2.id);
      const response = await request(app)
        .delete(`/api/contacts/${contact.id}`)
        .set("Authorization", `Bearer ${userData.sales2.token}`);
      expect(response.statusCode).toBe(403);
      expect(response.body.status).toBe("error");
    });
  });

  describe("GET contact relations", () => {
    it("should get contact activities for admin and manager", async () => {
      const contact = await createContact(userData.sales1.token);
      const response = await request(app)
        .get(`/api/contacts/${contact.id}/activities`)
        .set("Authorization", `Bearer ${userData.admin.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data).toBeDefined();
    });

    it("should get contact notes for admin and manager", async () => {
      const contact = await createContact(userData.sales1.token);
      const response = await request(app)
        .get(`/api/contacts/${contact.id}/notes`)
        .set("Authorization", `Bearer ${userData.admin.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data).toBeDefined();
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { email: { startsWith: "contact_" } },
    });
  });
});
