import request from "supertest";
import app from "./../src/app.js";
import {
  setupUsers,
  cleanupUsers,
  cleanupModels,
  createCustomer,
} from "./testHelpers.js";

describe("customer endpoints", () => {
  let uniquePrefix;
  let userData;

  beforeAll(async () => {
    await cleanupModels("customer_", ["customer"]);
    await cleanupUsers("cstm_");
    uniquePrefix = `cstm_${Date.now()}`;
    userData = await setupUsers(uniquePrefix);
  });

  beforeEach(() => {
    uniquePrefix = `customer_${Date.now()}`;
  });

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
      const customer = await createCustomer(
        userData.sales2.token,
        uniquePrefix
      );
      const response = await request(app)
        .get(`/api/customers/${customer.id}`)
        .set("Authorization", `Bearer ${userData.sales2.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data.id).toBe(customer.id);
    });

    it("should fail to get customer with invalid id", async () => {
      const response = await request(app)
        .get("/api/customers/99999")
        .set("Authorization", `Bearer ${userData.sales2.token}`);
      expect(response.statusCode).toBe(404);
      expect(response.body.status).toBe("error");
    });
  });

  describe("PATCH /api/customers/:id", () => {
    it("should update customer", async () => {
      const customer = await createCustomer(
        userData.sales1.token,
        uniquePrefix
      );
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

    it("should fail to update customer with invalid id", async () => {
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
      const customer = await createCustomer(
        userData.sales1.token,
        uniquePrefix
      );
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
      const customer = await createCustomer(
        userData.sales1.token,
        uniquePrefix
      );
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
      const customer = await createCustomer(
        userData.sales1.token,
        uniquePrefix
      );
      expect(customer.name).toBe(`${uniquePrefix}_Customer`);
      const response = await request(app)
        .delete(`/api/customers/${customer.id}`)
        .set("Authorization", `Bearer ${userData.sales1.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
    });

    it("should fail to delete customer with invalid id", async () => {
      const response = await request(app)
        .delete("/api/customers/99999")
        .set("Authorization", `Bearer ${userData.sales1.token}`);
      expect(response.statusCode).toBe(404);
      expect(response.body.status).toBe("error");
    });

    it("should delete a customer by ADMIN", async () => {
      const customer = await createCustomer(
        userData.sales1.token,
        uniquePrefix
      );
      expect(customer.name).toBe(`${uniquePrefix}_Customer`);
      const response = await request(app)
        .delete(`/api/customers/${customer.id}`)
        .set("Authorization", `Bearer ${userData.admin.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
    });

    it("should fail to delete non-owned customer", async () => {
      const customer = await createCustomer(
        userData.sales1.token,
        uniquePrefix
      );
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
      const customer = await createCustomer(
        userData.sales1.token,
        uniquePrefix
      );
      const response = await request(app)
        .get(`/api/customers/${customer.id}/contacts`)
        .set("Authorization", `Bearer ${userData.sales1.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data).toBeDefined();
    });

    it("should get customer's leads", async () => {
      const customer = await createCustomer(
        userData.sales1.token,
        uniquePrefix
      );
      const response = await request(app)
        .get(`/api/customers/${customer.id}/leads`)
        .set("Authorization", `Bearer ${userData.sales1.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data).toBeDefined();
    });

    it("should get customer's opportunities", async () => {
      const customer = await createCustomer(
        userData.sales1.token,
        uniquePrefix
      );
      const response = await request(app)
        .get(`/api/customers/${customer.id}/opportunities`)
        .set("Authorization", `Bearer ${userData.sales1.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data).toBeDefined();
    });

    it("should get customer's sales", async () => {
      const customer = await createCustomer(
        userData.sales1.token,
        uniquePrefix
      );
      const response = await request(app)
        .get(`/api/customers/${customer.id}/sales`)
        .set("Authorization", `Bearer ${userData.sales1.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data).toBeDefined();
    });

    it("should get customer's activities (only for admin and manager)", async () => {
      const customer = await createCustomer(
        userData.sales1.token,
        uniquePrefix
      );
      const response = await request(app)
        .get(`/api/customers/${customer.id}/activities`)
        .set("Authorization", `Bearer ${userData.admin.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data).toBeDefined();
    });
  });
});
