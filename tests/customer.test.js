import request from "supertest";
import app from "./../src/app.js";
import prisma from "./../src/repositories/prismaClient.js";

describe("customer endpoints", () => {
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
    await prisma.customer.deleteMany({
      where: { email: { startsWith: "cstm_" } },
    });
    await prisma.user.deleteMany({
      where: { email: { startsWith: "customer_" } },
    });

    uniquePrefix = `cstm_${Date.now()}`;
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
    uniquePrefix = `customer_${Date.now()}`;
  });

  afterEach(async () => {
    await prisma.customer.deleteMany({
      where: { email: { startsWith: "customer_" } },
    });
  });

  const createCustomer = async (token) => {
    const response = await request(app)
      .post("/api/customers")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: `${uniquePrefix}_Customer`,
        email: `${uniquePrefix}@example.com`,
        phone: "1234567890",
        company: `${uniquePrefix}_Company`,
      });
    return response.body.data;
  };

  describe("POST /api/customers", () => {
    it("should create a customer (all roles)", async () => {
      const response = await request(app)
        .post("/api/customers")
        .set("Authorization", `Bearer ${userData.sales1.token}`)
        .send({
          name: `${uniquePrefix}_Customer`,
          email: `${uniquePrefix}@example.com`,
          phone: "1234567890",
          company: `${uniquePrefix}_Company`,
        });
      expect(response.statusCode).toBe(201);
      expect(response.body.status).toBe("success");
    });

    it("should fail create customer by VIEWER", async () => {
      const response = await request(app)
        .post("/api/customers")
        .set("Authorization", `Bearer ${userData.viewer.token}`)
        .send({
          name: `${uniquePrefix}_Customer`,
          email: `${uniquePrefix}@example.com`,
          phone: "1234567890",
          company: `${uniquePrefix}_Company`,
        });
      expect(response.statusCode).toBe(403);
    });

    it("should fail create customer with duplicate email", async () => {
      const email = `${uniquePrefix}@example.com`;
      const response1 = await request(app)
        .post("/api/customers")
        .set("Authorization", `Bearer ${userData.sales1.token}`)
        .send({
          name: `${uniquePrefix}_Customer`,
          email,
          phone: "1234567890",
          company: `${uniquePrefix}_Company`,
        });
      expect(response1.statusCode).toBe(201);
      const response2 = await request(app)
        .post("/api/customers")
        .set("Authorization", `Bearer ${userData.sales1.token}`)
        .send({
          name: `${uniquePrefix}_Customer2`,
          email,
          phone: "1234567890",
          company: `${uniquePrefix}_Company2`,
        });
      expect(response2.statusCode).toBe(400);
      expect(response2.body.status).toBe("error");
    });

    it("should fail create customer with invalid data", async () => {
      const response = await request(app)
        .post("/api/customers")
        .set("Authorization", `Bearer ${userData.sales1.token}`)
        .send({
          name: "",
          email: "invalid-email",
          phone: "",
        });
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error");
    });
  });

  describe("GET /api/customers", () => {
    it("should get all customers (all roles)", async () => {
      const response = await request(app)
        .get("/api/customers")
        .set("Authorization", `Bearer ${userData.sales1.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
    });

    it("should get a customer by id", async () => {
      const customer = await createCustomer(userData.sales2.token);
      const response = await request(app)
        .get(`/api/customers/${customer.id}`)
        .set("Authorization", `Bearer ${userData.sales2.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data.id).toBe(customer.id);
    });

    it("should fail to get a non-existent customer", async () => {
      const response = await request(app)
        .get("/api/customers/99999")
        .set("Authorization", `Bearer ${userData.sales2.token}`);
      expect(response.statusCode).toBe(404);
      expect(response.body.status).toBe("error");
    });
  });

  describe("PATCH /api/customers/:id", () => {
    it("should update customer", async () => {
      const customer = await createCustomer(userData.sales1.token);
      expect(customer.name).toBe(`${uniquePrefix}_Customer`);
      const response = await request(app)
        .patch(`/api/customers/${customer.id}`)
        .set("Authorization", `Bearer ${userData.sales1.token}`)
        .send({
          name: `${uniquePrefix}_Customer_Updated`,
        });
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data.name).toBe(`${uniquePrefix}_Customer_Updated`);
    });

    it("should fail to update non-existent customer", async () => {
      const response = await request(app)
        .patch("/api/customers/99999")
        .set("Authorization", `Bearer ${userData.sales1.token}`)
        .send({
          name: `${uniquePrefix}_Customer_Updated`,
        });
      expect(response.statusCode).toBe(404);
      expect(response.body.status).toBe("error");
    });

    it("should update customer by ADMIN", async () => {
      const customer = await createCustomer(userData.sales1.token);
      expect(customer.name).toBe(`${uniquePrefix}_Customer`);
      const response = await request(app)
        .patch(`/api/customers/${customer.id}`)
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .send({
          name: `${uniquePrefix}_Customer_Updated`,
        });
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data.name).toBe(`${uniquePrefix}_Customer_Updated`);
    });

    it("should fail to update non-owned customer", async () => {
      const customer = await createCustomer(userData.sales1.token);
      expect(customer.createdByUserId).not.toBe(userData.sales2.id);
      const response = await request(app)
        .patch(`/api/customers/${customer.id}`)
        .set("Authorization", `Bearer ${userData.sales2.token}`)
        .send({
          name: `${uniquePrefix}_Customer_Updated`,
        });
      expect(response.statusCode).toBe(403);
      expect(response.body.status).toBe("error");
    });
  });

  describe("DELETE /api/customers/:id", () => {
    it("should delete a customer", async () => {
      const customer = await createCustomer(userData.sales1.token);
      expect(customer.name).toBe(`${uniquePrefix}_Customer`);
      const response = await request(app)
        .delete(`/api/customers/${customer.id}`)
        .set("Authorization", `Bearer ${userData.sales1.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
    });

    it("should fail to delete non-existent customer", async () => {
      const response = await request(app)
        .delete("/api/customers/99999")
        .set("Authorization", `Bearer ${userData.sales1.token}`);
      expect(response.statusCode).toBe(404);
      expect(response.body.status).toBe("error");
    });

    it("should delete a customer by ADMIN", async () => {
      const customer = await createCustomer(userData.sales1.token);
      expect(customer.name).toBe(`${uniquePrefix}_Customer`);
      const response = await request(app)
        .delete(`/api/customers/${customer.id}`)
        .set("Authorization", `Bearer ${userData.admin.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
    });

    it("should fail to delete non-owned customer", async () => {
      const customer = await createCustomer(userData.sales1.token);
      expect(customer.createdByUserId).not.toBe(userData.sales2.id);
      const response = await request(app)
        .delete(`/api/customers/${customer.id}`)
        .set("Authorization", `Bearer ${userData.sales2.token}`);
      expect(response.statusCode).toBe(403);
      expect(response.body.status).toBe("error");
    });
  });

  describe("GET a customer's relations", () => {
    it("should get customer's contacts", async () => {
      const customer = await createCustomer(userData.sales1.token);
      const response = await request(app)
        .get(`/api/customers/${customer.id}/contacts`)
        .set("Authorization", `Bearer ${userData.sales1.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data).toBeDefined();
    });

    it("should get customer's leads", async () => {
      const customer = await createCustomer(userData.sales1.token);
      const response = await request(app)
        .get(`/api/customers/${customer.id}/leads`)
        .set("Authorization", `Bearer ${userData.sales1.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data).toBeDefined();
    });

    it("should get customer's opportunities", async () => {
      const customer = await createCustomer(userData.sales1.token);
      const response = await request(app)
        .get(`/api/customers/${customer.id}/opportunities`)
        .set("Authorization", `Bearer ${userData.sales1.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data).toBeDefined();
    });

    it("should get customer's sales", async () => {
      const customer = await createCustomer(userData.sales1.token);
      const response = await request(app)
        .get(`/api/customers/${customer.id}/sales`)
        .set("Authorization", `Bearer ${userData.sales1.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data).toBeDefined();
    });

    it("should get customer's activities (only for admin and manager)", async () => {
      const customer = await createCustomer(userData.sales1.token);
      const response = await request(app)
        .get(`/api/customers/${customer.id}/activities`)
        .set("Authorization", `Bearer ${userData.admin.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data).toBeDefined();
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { email: { startsWith: "customer_" } },
    });
  });
});
