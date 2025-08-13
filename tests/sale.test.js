import request from "supertest";
import app from "../src/app.js";
import {
  setupUsers,
  cleanupUsers,
  cleanupModels,
  createCustomer,
  createProduct,
  createSale,
} from "./testHelpers.js";

describe("Sale Endpoints", () => {
  let uniquePrefix;
  let userData;

  beforeAll(async () => {
    await cleanupModels("sale_", ["product", "customer"]);
    await cleanupUsers("sl_");
    uniquePrefix = `sl_${Date.now()}`;
    userData = await setupUsers(uniquePrefix);
  });

  beforeEach(() => {
    uniquePrefix = `sale_${Date.now()}`;
  });

  describe("POST /api/sales", () => {
    it("should create a sale with one item (all role except VIEWER)", async () => {
      const customer = await createCustomer(
        userData.sales1.token,
        uniquePrefix
      );
      const product = await createProduct(userData.admin.token, uniquePrefix);
      const res = await request(app)
        .post("/api/sales")
        .set("Authorization", `Bearer ${userData.sales1.token}`)
        .send({
          customerId: customer.id,
          items: [{ productId: product.id, quantity: 1 }],
        });
      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe("success");
      expect(res.body.data.items.length).toBe(1);
      expect(res.body.data.customer.id).toBe(customer.id);
      expect(res.body.data.items[0].product.id).toBe(product.id);
    });

    it("should create a sale by ADMIN", async () => {
      const customer = await createCustomer(userData.admin.token, uniquePrefix);
      const product = await createProduct(userData.admin.token, uniquePrefix);
      const res = await request(app)
        .post("/api/sales")
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .send({
          customerId: customer.id,
          items: [{ productId: product.id, quantity: 1 }],
        });
      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe("success");
    });

    it("should create a sale with multiple items and compute totalAmount accurately", async () => {
      const customer = await createCustomer(
        userData.sales1.token,
        uniquePrefix
      );
      const product1 = await createProduct(
        userData.admin.token,
        `${uniquePrefix}_1`,
        1000
      );
      const product2 = await createProduct(
        userData.admin.token,
        `${uniquePrefix}_2`,
        5500
      );
      const response = await request(app)
        .post("/api/sales")
        .set("Authorization", `Bearer ${userData.manager.token}`)
        .send({
          customerId: customer.id,
          items: [
            { productId: product1.id, quantity: 1 },
            { productId: product2.id, quantity: 2 },
          ],
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.status).toBe("success");
      expect(response.body.data.customer.id).toBe(customer.id);
      expect(response.body.data.items.length).toBe(2);
      expect(response.body.data.totalAmount).toBe("12000");
    });

    it("should fail to create sale by VIEWER", async () => {
      const customer = await createCustomer(
        userData.sales2.token,
        uniquePrefix
      );
      const product = await createProduct(
        userData.admin.token,
        uniquePrefix,
        10
      );
      const res = await request(app)
        .post("/api/sales")
        .set("Authorization", `Bearer ${userData.viewer.token}`)
        .send({
          customerId: customer.id,
          items: [{ productId: product.id, quantity: 1 }],
        });
      expect(res.statusCode).toBe(403);
      expect(res.body.status).toBe("error");
    });

    it("should fail to create sale with missing items", async () => {
      const customer = await createCustomer(
        userData.sales2.token,
        uniquePrefix
      );
      const res = await request(app)
        .post("/api/sales")
        .set("Authorization", `Bearer ${userData.sales2.token}`)
        .send({ customerId: customer.id, items: [] });
      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe("error");
    });

    it("should fail to create sale with invalid customer id", async () => {
      const product = await createProduct(
        userData.admin.token,
        uniquePrefix,
        10
      );
      const res = await request(app)
        .post("/api/sales")
        .set("Authorization", `Bearer ${userData.sales1.token}`)
        .send({
          customerId: 999999,
          items: [{ productId: product.id, quantity: 1 }],
        });
      expect(res.statusCode).toBe(404);
      expect(res.body.status).toBe("error");
    });

    it("should fail to create sale with invalid product id", async () => {
      const customer = await createCustomer(
        userData.sales1.token,
        uniquePrefix
      );
      const res = await request(app)
        .post("/api/sales")
        .set("Authorization", `Bearer ${userData.sales1.token}`)
        .send({
          customerId: customer.id,
          items: [{ productId: 999999, quantity: 1 }],
        });
      expect(res.statusCode).toBe(404);
      expect(res.body.status).toBe("error");
    });

    it("should fail to create sale with non-positive quantity", async () => {
      const customer = await createCustomer(
        userData.sales1.token,
        uniquePrefix
      );
      const product = await createProduct(
        userData.admin.token,
        uniquePrefix,
        10
      );
      const res = await request(app)
        .post("/api/sales")
        .set("Authorization", `Bearer ${userData.sales1.token}`)
        .send({
          customerId: customer.id,
          items: [{ productId: product.id, quantity: -1 }],
        });
      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe("error");
    });
  });

  describe("GET /api/sales", () => {
    it("should list all sales (all roles)", async () => {
      const res = await request(app)
        .get("/api/sales")
        .set("Authorization", `Bearer ${userData.viewer.token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe("success");
    });
    it("should get a sale by id (all roles)", async () => {
      const customer = await createCustomer(
        userData.sales2.token,
        uniquePrefix
      );
      const product = await createProduct(
        userData.admin.token,
        uniquePrefix,
        15.25
      );
      const sale = await createSale(
        userData.sales2.token,
        customer.id,
        product.id
      );

      const res = await request(app)
        .get(`/api/sales/${sale.id}`)
        .set("Authorization", `Bearer ${userData.viewer.token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.data.id).toBe(sale.id);
    });

    it("should fail to get sale with invalid id", async () => {
      const res = await request(app)
        .get("/api/sales/999999")
        .set("Authorization", `Bearer ${userData.viewer.token}`);
      expect(res.statusCode).toBe(404);
      expect(res.body.status).toBe("error");
    });
  });

  describe("PATCH /api/sales/:id", () => {
    it("should update sale status by owner", async () => {
      const customer = await createCustomer(
        userData.sales1.token,
        uniquePrefix
      );
      const product = await createProduct(
        userData.admin.token,
        uniquePrefix,
        30
      );
      const sale = await createSale(
        userData.sales2.token,
        customer.id,
        product.id
      );

      const res = await request(app)
        .patch(`/api/sales/${sale.id}`)
        .set("Authorization", `Bearer ${userData.sales2.token}`)
        .send({ status: "COMPLETED" });
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.data.status).toBe("COMPLETED");
    });

    it("should update sale status by ADMIN", async () => {
      const customer = await createCustomer(
        userData.sales1.token,
        uniquePrefix
      );
      const product = await createProduct(
        userData.admin.token,
        uniquePrefix,
        30
      );
      const sale = await createSale(
        userData.sales2.token,
        customer.id,
        product.id
      );

      const res = await request(app)
        .patch(`/api/sales/${sale.id}`)
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .send({ status: "CANCELLED" });
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.data.status).toBe("CANCELLED");
    });

    it("should fail to update sale by non-owner", async () => {
      const customer = await createCustomer(
        userData.sales1.token,
        uniquePrefix
      );
      const product = await createProduct(
        userData.admin.token,
        uniquePrefix,
        30
      );
      const sale = await createSale(
        userData.sales1.token,
        customer.id,
        product.id
      );

      const res = await request(app)
        .patch(`/api/sales/${sale.id}`)
        .set("Authorization", `Bearer ${userData.sales2.token}`)
        .send({ status: "COMPLETED" });
      expect(res.statusCode).toBe(403);
      expect(res.body.status).toBe("error");
    });

    it("should fail to update sale with invalid id", async () => {
      const res = await request(app)
        .patch("/api/sales/999999")
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .send({ status: "COMPLETED" });
      expect(res.statusCode).toBe(404);
      expect(res.body.status).toBe("error");
    });

    it("should fail to update with invalid status value", async () => {
      const customer = await createCustomer(
        userData.sales1.token,
        uniquePrefix
      );
      const product = await createProduct(
        userData.admin.token,
        uniquePrefix,
        30
      );
      const sale = await createSale(
        userData.sales1.token,
        customer.id,
        product.id
      );

      const res = await request(app)
        .patch(`/api/sales/${sale.id}`)
        .set("Authorization", `Bearer ${userData.sales1.token}`)
        .send({ status: "INVALID" });
      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe("error");
    });

    it("should fail to update with invalid id param type", async () => {
      const res = await request(app)
        .patch("/api/sales/invalid")
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .send({ status: "COMPLETED" });
      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe("error");
    });

    it("should fail to update sale already completed/cancelled", async () => {
      const customer = await createCustomer(
        userData.sales1.token,
        uniquePrefix
      );
      const product = await createProduct(
        userData.admin.token,
        uniquePrefix,
        30
      );
      const sale = await createSale(
        userData.sales1.token,
        customer.id,
        product.id
      );

      const res1 = await request(app)
        .patch(`/api/sales/${sale.id}`)
        .set("Authorization", `Bearer ${userData.sales1.token}`)
        .send({ status: "COMPLETED" });
      expect(res1.statusCode).toBe(200);

      const res2 = await request(app)
        .patch(`/api/sales/${sale.id}`)
        .set("Authorization", `Bearer ${userData.sales1.token}`)
        .send({ status: "CANCELLED" });
      expect(res2.statusCode).toBe(400);
      expect(res2.body.status).toBe("error");
    });
  });
});
