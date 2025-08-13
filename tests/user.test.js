import request from "supertest";
import app from "../src/app.js";
import { setupUsers, cleanupUsers, createUser } from "./testHelpers.js";

describe("User Endpoints", () => {
  let uniquePrefix;
  let userData;

  beforeAll(async () => {
    await cleanupUsers("usr_");
    uniquePrefix = `usr_${Date.now()}`;
    userData = await setupUsers(uniquePrefix);
  });

  beforeEach(() => {
    uniquePrefix = `usr_${Date.now()}`;
  });

  describe("GET /api/users", () => {
    it("should get all users (ADMIN only)", async () => {
      const res = await request(app)
        .get("/api/users")
        .set("Authorization", `Bearer ${userData.admin.token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe("success");
    });

    it("should fail to get all users for non-admin", async () => {
      const res = await request(app)
        .get("/api/users")
        .set("Authorization", `Bearer ${userData.manager.token}`);
      expect(res.statusCode).toBe(403);
      expect(res.body.status).toBe("error");
    });
    it("should get user by id for ADMIN", async () => {
      const res = await request(app)
        .get(`/api/users/${userData.sales1.id}`)
        .set("Authorization", `Bearer ${userData.admin.token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.data.id).toBe(userData.sales1.id);
    });

    it("should get own user by id (self)", async () => {
      const me = userData.viewer;
      const res = await request(app)
        .get(`/api/users/${me.id}`)
        .set("Authorization", `Bearer ${me.token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.data.id).toBe(me.id);
    });

    it("should fail to get other user by non-owner", async () => {
      const res = await request(app)
        .get(`/api/users/${userData.manager.id}`)
        .set("Authorization", `Bearer ${userData.sales1.token}`);
      expect(res.statusCode).toBe(403);
      expect(res.body.status).toBe("error");
    });

    it("should fail to get user by invalid id", async () => {
      const res = await request(app)
        .get(`/api/users/999999`)
        .set("Authorization", `Bearer ${userData.admin.token}`);
      expect(res.statusCode).toBe(404);
      expect(res.body.status).toBe("error");
    });
  });

  describe("POST /api/users", () => {
    it("should create a new user (ADMIN only)", async () => {
      const res = await request(app)
        .post("/api/users")
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .send({
          username: `${uniquePrefix}_admin_create`,
          email: `${uniquePrefix}_admin@example.com`,
          password: "password123",
          role: "SALES",
        });
      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe("success");
    });

    it("should fail to create user by non-admin", async () => {
      const payload = {
        username: `${uniquePrefix}_nonadmin_create`,
        email: `${uniquePrefix}_nonadmin@example.com`,
        password: "password123",
      };
      const res = await request(app)
        .post("/api/users")
        .set("Authorization", `Bearer ${userData.manager.token}`)
        .send(payload);
      expect(res.statusCode).toBe(403);
      expect(res.body.status).toBe("error");
    });

    it("should fail to create user with invalid data", async () => {
      const res = await request(app)
        .post("/api/users")
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .send({
          username: "",
          email: "INVALID",
          password: "",
          role: "INVALID",
        });
    });

    it("should fail to create user with duplicate username", async () => {
      const username = `${uniquePrefix}_dupuser`;
      const payload1 = {
        username,
        email: `${uniquePrefix}_dup1@example.com`,
        password: "password123",
      };
      const payload2 = {
        username,
        email: `${uniquePrefix}_dup2@example.com`,
        password: "password123",
      };
      const res1 = await request(app)
        .post("/api/users")
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .send(payload1);
      expect(res1.statusCode).toBe(201);

      const res2 = await request(app)
        .post("/api/users")
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .send(payload2);
      expect(res2.statusCode).toBe(400);
      expect(res2.body.status).toBe("error");
    });

    it("should fail to create user with duplicate email", async () => {
      const email = `${uniquePrefix}_dupe@example.com`;
      const payload1 = {
        username: `${uniquePrefix}_user1`,
        email,
        password: "password123",
      };
      const payload2 = {
        username: `${uniquePrefix}_user2`,
        email,
        password: "password123",
      };
      const res1 = await request(app)
        .post("/api/users")
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .send(payload1);
      expect(res1.statusCode).toBe(201);

      const res2 = await request(app)
        .post("/api/users")
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .send(payload2);
      expect(res2.statusCode).toBe(400);
      expect(res2.body.status).toBe("error");
    });
  });

  describe("PATCH /api/users/:id", () => {
    it("should update user role by ADMIN", async () => {
      const user = await createUser(
        userData.admin.token,
        uniquePrefix,
        "VIEWER"
      );
      const res = await request(app)
        .patch(`/api/users/${user.id}`)
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .send({ role: "SALES" });
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.data.role).toBe("SALES");
      console.error("should update user role by ADMIN", res.body);
    });

    it("should fail to update role by non-admin", async () => {
      const newUser = await createUser(
        userData.admin.token,
        uniquePrefix,
        "VIEWER"
      );
      const userLogin = await request(app)
        .post("/api/auth/login")
        .send({ emailOrUsername: newUser.username, password: "password123" });
      const res = await request(app)
        .patch(`/api/users/${newUser.id}`)
        .set("Authorization", `Bearer ${userLogin.body.token}`)
        .send({ role: "SALES" });
      expect(res.statusCode).toBe(403);
      expect(res.body.status).toBe("error");
    });

    it("should fail to update other user by non-admin", async () => {
      const res = await request(app)
        .patch(`/api/users/${userData.manager.id}`)
        .set("Authorization", `Bearer ${userData.sales2.token}`)
        .send({ role: "VIEWER" });
      expect(res.statusCode).toBe(403);
      expect(res.body.status).toBe("error");
    });

    it("should fail to update user by invalid id", async () => {
      const res = await request(app)
        .patch(`/api/users/999999`)
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .send({ role: "SALES" });
      expect(res.statusCode).toBe(404);
      expect(res.body.status).toBe("error");
    });

    it("should fail to update with invalid role value", async () => {
      const res = await request(app)
        .patch(`/api/users/${userData.sales2.id}`)
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .send({ role: "INVALID" });
      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe("error");
    });
  });

  describe("DELETE /api/users/:id", () => {
    it("should delete a user by ADMIN (and not self)", async () => {
      const user = await createUser(
        userData.admin.token,
        uniquePrefix,
        "MANAGER"
      );
      const res = await request(app)
        .delete(`/api/users/${user.id}`)
        .set("Authorization", `Bearer ${userData.admin.token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe("success");
    });

    it("should fail to delete self by ADMIN", async () => {
      const res = await request(app)
        .delete(`/api/users/${userData.admin.id}`)
        .set("Authorization", `Bearer ${userData.admin.token}`);
      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe("error");
    });

    it("should fail to delete by non-admin", async () => {
      const res = await request(app)
        .delete(`/api/users/${userData.viewer.id}`)
        .set("Authorization", `Bearer ${userData.sales1.token}`);
      expect(res.statusCode).toBe(403);
      expect(res.body.status).toBe("error");
    });

    it("should fail to delete user with invalid id", async () => {
      const res = await request(app)
        .delete(`/api/users/999999`)
        .set("Authorization", `Bearer ${userData.admin.token}`);
      expect(res.statusCode).toBe(404);
      expect(res.body.status).toBe("error");
    });
  });
});
