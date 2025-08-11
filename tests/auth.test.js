import request from "supertest";
import app from "../src/app.js";
import prisma from "../src/repositories/prismaClient.js";

describe("auth endpoints", () => {
  let uniquePrefix;

  beforeEach(() => {
    uniquePrefix = `auth_${Date.now()}}`;
  });

  afterEach(async () => {
    await prisma.user.deleteMany({
      where: { username: { startsWith: "auth_" } },
    });
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user", async () => {
      const email = `${uniquePrefix}@example.com`;
      const username = `${uniquePrefix}_user`;

      const res = await request(app)
        .post("/api/auth/register")
        .send({ username, email, password: "password123" });

      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe("success");
    });
    it("should fail register with existing username", async () => {
      const email = `${uniquePrefix}@example.com`;
      const username = `${uniquePrefix}_user`;

      await request(app)
        .post("/api/auth/register")
        .send({ username, email, password: "password123" });

      const res = await request(app)
        .post("/api/auth/register")
        .send({ username, email, password: "password123" });

      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe("error");
    });
    it("should fail register with existing email", async () => {
      const email = `${uniquePrefix}@example.com`;
      const username = `${uniquePrefix}_user`;

      await request(app)
        .post("/api/auth/register")
        .send({ username, email, password: "password123" });

      const res = await request(app)
        .post("/api/auth/register")
        .send({ username, email, password: "password123" });

      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe("error");
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login an existing user", async () => {
      const email = `${uniquePrefix}@example.com`;
      const username = `${uniquePrefix}_user`;

      await request(app)
        .post("/api/auth/register")
        .send({ username, email, password: "password123" });

      const res = await request(app)
        .post("/api/auth/login")
        .send({ emailOrUsername: username, password: "password123" });

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body).toHaveProperty("token");
    });
    it("should fail login with invalid credentials", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ emailOrUsername: "invalid", password: "password123" });

      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe("error");
    });
  });
});
