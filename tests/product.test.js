import request from "supertest";
import app from "../src/app.js";
import { setupUsers, cleanupUsers, cleanupModels } from "./testHelpers.js";

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
      const roles = [
        userData.manager,
        userData.sales1,
        userData.sales2,
        userData.viewer,
      ];
      for (const role of roles) {
        const res = await request(app)
          .post("/api/products")
          .set("Authorization", `Bearer ${role.token}`)
          .send({ name: `${uniquePrefix}_Product`, price: 10.0 });
        expect(res.statusCode).toBe(403);
        expect(res.body.status).toBe("error");
      }
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
      const createRes = await request(app)
        .post("/api/products")
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .send({ name: `${uniquePrefix}_Product`, price: 49.5 });
      const product = createRes.body.data;

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
      const createRes = await request(app)
        .post("/api/products")
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .send({ name: `${uniquePrefix}_Product`, price: 10.0 });
      const product = createRes.body.data;

      const res = await request(app)
        .patch(`/api/products/${product.id}`)
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .send({ name: `${uniquePrefix}_Product_Updated`, price: 20.25 });
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.data.name).toBe(`${uniquePrefix}_Product_Updated`);
    });

    it("should fail to update product by non-admin roles", async () => {
      const createRes = await request(app)
        .post("/api/products")
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .send({ name: `${uniquePrefix}_Product`, price: 10.0 });
      const product = createRes.body.data;

      const roles = [
        userData.manager,
        userData.sales1,
        userData.sales2,
        userData.viewer,
      ];
      for (const role of roles) {
        const res = await request(app)
          .patch(`/api/products/${product.id}`)
          .set("Authorization", `Bearer ${role.token}`)
          .send({ name: `${uniquePrefix}_Product_By_${role.username}` });
        expect(res.statusCode).toBe(403);
        expect(res.body.status).toBe("error");
      }
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
      const createRes = await request(app)
        .post("/api/products")
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .send({ name: `${uniquePrefix}_Product`, price: 10.0 });
      const product = createRes.body.data;

      const res = await request(app)
        .delete(`/api/products/${product.id}`)
        .set("Authorization", `Bearer ${userData.admin.token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe("success");

      // verify it's not retrievable anymore
      const res2 = await request(app)
        .get(`/api/products/${product.id}`)
        .set("Authorization", `Bearer ${userData.viewer.token}`);
      expect(res2.statusCode).toBe(404);
    });

    it("should fail to delete product by non-admin roles", async () => {
      const createRes = await request(app)
        .post("/api/products")
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .send({ name: `${uniquePrefix}_Product`, price: 10.0 });
      const product = createRes.body.data;

      const roles = [
        userData.manager,
        userData.sales1,
        userData.sales2,
        userData.viewer,
      ];
      for (const role of roles) {
        const res = await request(app)
          .delete(`/api/products/${product.id}`)
          .set("Authorization", `Bearer ${role.token}`);
        expect(res.statusCode).toBe(403);
        expect(res.body.status).toBe("error");
      }
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
