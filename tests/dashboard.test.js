import request from "supertest";
import app from "../src/app.js";
import { setupUsers, cleanupUsers, createUser } from "./testHelpers.js";

describe("Dashboard Endpoints", () => {
  let uniquePrefix;
  let userData;

  beforeAll(async () => {
    await cleanupUsers("dash_");
    uniquePrefix = `dash_${Date.now()}`;
    userData = await setupUsers(uniquePrefix);
  });

  beforeEach(() => {
    uniquePrefix = `dash_${Date.now()}`;
  });

  afterAll(async () => {
    await cleanupUsers("dash_");
  });

  describe("GET /api/dashboard", () => {
    it("should create default dashboard on first access and return it (VIEWER)", async () => {
      const res = await request(app)
        .get("/api/dashboard")
        .set("Authorization", `Bearer ${userData.viewer.token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.data.dashboard).toBeDefined();
      expect(res.body.data.dashboard.name).toContain(userData.viewer.username);
      expect(res.body.data.dynamicData).toBeDefined();
    });

    it("should return dashboard and dynamic data for ADMIN", async () => {
      const res = await request(app)
        .get("/api/dashboard")
        .set("Authorization", `Bearer ${userData.admin.token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.data.dashboard).toBeDefined();
      expect(res.body.data.dynamicData).toBeDefined();
    });

    it("should return dashboard and dynamic data for MANAGER/SALES", async () => {
      const mgr = await request(app)
        .get("/api/dashboard")
        .set("Authorization", `Bearer ${userData.manager.token}`);
      expect(mgr.statusCode).toBe(200);
      expect(mgr.body.status).toBe("success");

      const sales = await request(app)
        .get("/api/dashboard")
        .set("Authorization", `Bearer ${userData.sales1.token}`);
      expect(sales.statusCode).toBe(200);
      expect(sales.body.status).toBe("success");
      expect(sales.body.data.dynamicData).toBeDefined();
    });
  });

  describe("PATCH /api/dashboard", () => {
    it("should update dashboard for authenticated user", async () => {
      const newUser = await createUser(
        userData.admin.token,
        uniquePrefix,
        "SALES"
      );
      const userLogin = await request(app)
        .post("/api/auth/login")
        .send({ emailOrUsername: newUser.username, password: "password123" });
      await request(app)
        .get("/api/dashboard")
        .set("Authorization", `Bearer ${userLogin.body.token}`);
      const payload = {
        name: `${uniquePrefix}_Updated Dashboard`,
        description: `${uniquePrefix} Description`,
        layout: { widgets: [{ type: "chart", id: "w1" }] },
      };
      const res = await request(app)
        .patch("/api/dashboard")
        .set("Authorization", `Bearer ${userLogin.body.token}`)
        .send(payload);
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.data.name).toBe(payload.name);
      expect(res.body.data.description).toBe(payload.description);
      expect(res.body.data.layout).toBeDefined();
    });

    it("should fail to update with invalid payload", async () => {
      const payloads = [
        { description: "no name", layout: {} },
        { name: `${uniquePrefix}_Name`, layout: "invalid" },
      ];
      for (const body of payloads) {
        const res = await request(app)
          .patch("/api/dashboard")
          .set("Authorization", `Bearer ${userData.viewer.token}`)
          .send(body);
        expect(res.statusCode).toBe(400);
        expect(res.body.status).toBe("error");
      }
    });
  });
});
