import request from "supertest";
import app from "../src/app.js";
import {
  setupUsers,
  cleanupUsers,
  cleanupModels,
  createProduct,
} from "./testHelpers.js";

describe("Product Endpoints", () => {
  let uniquePrefix;
  let userData;

  beforeAll(async () => {
    await cleanupModels("product_", ["product"]);
    await cleanupUsers("prd_");
    uniquePrefix = `prd_${Date.now()}`;
    userData = await setupUsers(uniquePrefix);
  });

  beforeEach(() => {
    uniquePrefix = `product_${Date.now()}`;
  });

  describe("POST /api/products", () => {
    it("should create a new product (ADMIN only)", async () => {
      const res = await request(app)
        .post("/api/products")
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .send({
          name: `${uniquePrefix}_Product`,
          price: 199.99,
          description: `${uniquePrefix} description`,
        });
      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe("success");
      expect(res.body.data.name).toBe(`${uniquePrefix}_Product`);
      expect(res.body.data.price).toBe("199.99");
    });

    it("should fail to create product by non-admin roles", async () => {
      const response = await request(app)
        .post("/api/products")
        .set("Authorization", `Bearer ${userData.sales1.token}`)
        .send({
          name: `${uniquePrefix}_Product`,
          price: 199.99,
          description: `${uniquePrefix} description`,
        });
      expect(response.statusCode).toBe(403);
      expect(response.body.status).toBe("error");
    });

    it("should fail to create product with invalid data", async () => {
      const res = await request(app)
        .post("/api/products")
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .send({
          price: 0.5,
        });
      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe("error");
    });
  });

  describe("GET /api/products", () => {
    it("should get all products (all roles)", async () => {
      const res = await request(app)
        .get("/api/products")
        .set("Authorization", `Bearer ${userData.viewer.token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe("success");
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("should get a product by ID (all roles)", async () => {
      const product = await createProduct(userData.admin.token, uniquePrefix);

      const res = await request(app)
        .get(`/api/products/${product.id}`)
        .set("Authorization", `Bearer ${userData.sales1.token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.data.id).toBe(product.id);
    });

    it("should fail to get product with invalid id", async () => {
      const res = await request(app)
        .get("/api/products/999999")
        .set("Authorization", `Bearer ${userData.viewer.token}`);
      expect(res.statusCode).toBe(404);
      expect(res.body.status).toBe("error");
    });
  });

  describe("PATCH /api/products/:id", () => {
    it("should update a product (ADMIN only)", async () => {
      const product = await createProduct(userData.admin.token, uniquePrefix);

      const res = await request(app)
        .patch(`/api/products/${product.id}`)
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .send({ name: `${uniquePrefix}_Product_Updated`, price: 20.25 });
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.data.name).toBe(`${uniquePrefix}_Product_Updated`);
    });

    it("should fail to update product by non-admin roles", async () => {
      const product = await createProduct(userData.admin.token, uniquePrefix);
      const response = await request(app)
        .patch(`/api/products/${product.id}`)
        .set("Authorization", `Bearer ${userData.manager.token}`)
        .send({ name: `${uniquePrefix}_Product_Updated`, price: 20.25 });
      expect(response.statusCode).toBe(403);
      expect(response.body.status).toBe("error");
    });

    it("should fail to update product with invalid id", async () => {
      const res = await request(app)
        .patch("/api/products/999999")
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .send({ name: `${uniquePrefix}_Unknown` });
      expect(res.statusCode).toBe(404);
      expect(res.body.status).toBe("error");
    });
  });

  describe("DELETE /api/products/:id", () => {
    it("should delete (soft) a product (ADMIN only)", async () => {
      const product = await createProduct(userData.admin.token, uniquePrefix);
      const res = await request(app)
        .delete(`/api/products/${product.id}`)
        .set("Authorization", `Bearer ${userData.admin.token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe("success");
    });

    it("should fail to delete product by non-admin roles", async () => {
      const product = await createProduct(userData.admin.token, uniquePrefix);
      const response = await request(app)
        .delete(`/api/products/${product.id}`)
        .set("Authorization", `Bearer ${userData.sales1.token}`);
      expect(response.statusCode).toBe(403);
      expect(response.body.status).toBe("error");
    });

    it("should fail to delete product with invalid id", async () => {
      const res = await request(app)
        .delete("/api/products/999999")
        .set("Authorization", `Bearer ${userData.admin.token}`);
      expect(res.statusCode).toBe(404);
      expect(res.body.status).toBe("error");
    });
  });
});
