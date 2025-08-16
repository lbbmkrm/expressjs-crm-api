import app from "../src/app.js";
import request from "supertest";
import {
  setupUsers,
  cleanupUsers,
  cleanupModels,
  createCampaign,
  makeDate,
} from "./testHelpers.js";

describe("Campaign endpoints", () => {
  let userData;
  let uniquePrefix;

  beforeAll(async () => {
    await cleanupModels("campaign_", ["campaign"]);
    await cleanupUsers("cmp_");
    uniquePrefix = `cmp_${Date.now()}`;
    userData = await setupUsers(uniquePrefix);
  });

  beforeEach(() => {
    uniquePrefix = `campaign_${Date.now()}`;
  });

  describe("POST /api/campaigns", () => {
    it("should create a campaign (all roles except viewer)", async () => {
      const res = await request(app)
        .post("/api/campaigns")
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .send({
          name: `${uniquePrefix}_Campaign`,
          description: `${uniquePrefix}_Campaign_Description`,
          type: "OTHER",
          status: "PLANNING",
          startDate: makeDate(1),
          endDate: makeDate(2),
          budget: 1000,
        });
      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe("success");
    });
    it("should fail to create a campaign (viewer)", async () => {
      const res = await request(app)
        .post("/api/campaigns")
        .set("Authorization", `Bearer ${userData.viewer.token}`)
        .send({
          name: `${uniquePrefix}_Campaign`,
          description: `${uniquePrefix}_Campaign_Description`,
          type: "OTHER",
          status: "PLANNING",
          startDate: makeDate(1),
          endDate: makeDate(2),
          budget: 1000,
        });
      expect(res.statusCode).toBe(403);
      expect(res.body.status).toBe("error");
    });
    it("should fail to create a campaign with invalid type", async () => {
      const res = await request(app)
        .post("/api/campaigns")
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .send({
          name: `${uniquePrefix}_Campaign`,
          description: `${uniquePrefix}_Campaign_Description`,
          type: "INVALID",
          status: "PLANNING",
          startDate: makeDate(1),
          endDate: makeDate(2),
          budget: 1000,
        });
      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe("error");
    });
    it("should fail to create a campaign with invalid status", async () => {
      const res = await request(app)
        .post("/api/campaigns")
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .send({
          name: `${uniquePrefix}_Campaign`,
          description: `${uniquePrefix}_Campaign_Description`,
          type: "OTHER",
          status: "INVALID",
          startDate: makeDate(1),
          endDate: makeDate(2),
          budget: 1000,
        });
      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe("error");
    });
    it("should fail to create a campaign with passed start date", async () => {
      const res = await request(app)
        .post("/api/campaigns")
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .send({
          name: `${uniquePrefix}_Campaign`,
          description: `${uniquePrefix}_Campaign_Description`,
          type: "OTHER",
          status: "PLANNING",
          startDate: makeDate(-1),
          endDate: makeDate(2),
          budget: 1000,
        });
      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe("error");
    });
    it("should fail to create a campaign with passed end date", async () => {
      const res = await request(app)
        .post("/api/campaigns")
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .send({
          name: `${uniquePrefix}_Campaign`,
          description: `${uniquePrefix}_Campaign_Description`,
          type: "OTHER",
          status: "PLANNING",
          startDate: makeDate(1),
          endDate: makeDate(0),
          budget: 1000,
        });
      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe("error");
    });
    it("should fail to create a campaign with start date greater than end date", async () => {
      const res = await request(app)
        .post("/api/campaigns")
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .send({
          name: `${uniquePrefix}_Campaign`,
          description: `${uniquePrefix}_Campaign_Description`,
          type: "OTHER",
          status: "PLANNING",
          startDate: makeDate(2),
          endDate: makeDate(1),
          budget: 1000,
        });
      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe("error");
    });
  });
  describe("GET /api/campaigns", () => {
    it("should get all campaigns (all roles)", async () => {
      const res = await request(app)
        .get("/api/campaigns")
        .set("Authorization", `Bearer ${userData.viewer.token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe("success");
    });
    it("should get all campaigns by status", async () => {
      const res = await request(app)
        .get("/api/campaigns?status=PLANNING")
        .set("Authorization", `Bearer ${userData.viewer.token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe("success");
    });
    it("should get all campaigns by type", async () => {
      const res = await request(app)
        .get("/api/campaigns?type=OTHER")
        .set("Authorization", `Bearer ${userData.viewer.token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe("success");
    });
    it("should fail to get all campaign by invalid type", async () => {
      const res = await request(app)
        .get("/api/campaigns?type=INVALID")
        .set("Authorization", `Bearer ${userData.viewer.token}`);
      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe("error");
    });
    it("should fail to get all campaign by invalid status", async () => {
      const res = await request(app)
        .get("/api/campaigns?status=INVALID")
        .set("Authorization", `Bearer ${userData.viewer.token}`);
      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe("error");
    });
    it("should fail to get all campaign by invalid type", async () => {
      const res = await request(app)
        .get("/api/campaigns?type=INVALID")
        .set("Authorization", `Bearer ${userData.viewer.token}`);
      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe("error");
    });
    it("should get a campaign by id (all roles)", async () => {
      const campaign = await createCampaign(userData.admin.token, uniquePrefix);
      const res = await request(app)
        .get(`/api/campaigns/${campaign.id}`)
        .set("Authorization", `Bearer ${userData.viewer.token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.data.id).toBe(campaign.id);
    });
    it("should fail to get a campaign by non existing id", async () => {
      const res = await request(app)
        .get(`/api/campaigns/9999`)
        .set("Authorization", `Bearer ${userData.viewer.token}`);
      expect(res.statusCode).toBe(404);
      expect(res.body.status).toBe("error");
    });
    it("should fail to get a campaign by invalid id", async () => {
      const res = await request(app)
        .get(`/api/campaigns/INVALID`)
        .set("Authorization", `Bearer ${userData.viewer.token}`);
      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe("error");
    });
    it("should get all leads by campaign id (all roles)", async () => {
      const campaign = await createCampaign(userData.admin.token, uniquePrefix);
      const res = await request(app)
        .get(`/api/campaigns/${campaign.id}/leads`)
        .set("Authorization", `Bearer ${userData.viewer.token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe("success");
    });
  });
  describe("PATCH /api/campaigns/:id", () => {
    it("should update a campaign (only admin and owner)", async () => {
      const campaign = await createCampaign(
        userData.sales1.token,
        uniquePrefix
      );
      expect(campaign.status).toBe("PLANNING");
      expect(campaign.type).toBe("OTHER");
      expect(campaign.budget).toBe("1000");
      const res = await request(app)
        .patch(`/api/campaigns/${campaign.id}`)
        .set("Authorization", `Bearer ${userData.sales1.token}`)
        .send({
          name: `${uniquePrefix}_Campaign_Updated`,
          description: `${uniquePrefix}_Campaign_Description_Updated`,
          type: "SOCIAL_MEDIA",
          status: "ACTIVE",
          startDate: makeDate(4),
          endDate: makeDate(5),
          budget: 9999,
        });
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.data.name).toBe(`${uniquePrefix}_Campaign_Updated`);
      expect(res.body.data.type).toBe("SOCIAL_MEDIA");
      expect(res.body.data.status).toBe("ACTIVE");
      expect(res.body.data.budget).toBe("9999");
    });
    it("should fail to update a campaign by non existing id", async () => {
      const res = await request(app)
        .patch(`/api/campaigns/9999`)
        .set("Authorization", `Bearer ${userData.sales1.token}`)
        .send({
          name: `${uniquePrefix}_Campaign_Updated`,
          description: `${uniquePrefix}_Campaign_Description_Updated`,
          type: "SOCIAL_MEDIA",
          status: "ACTIVE",
          startDate: makeDate(2),
          endDate: makeDate(1),
          budget: 9999,
        });
      expect(res.statusCode).toBe(404);
      expect(res.body.status).toBe("error");
    });
    it("should fail to update a campaign by invalid id", async () => {
      const res = await request(app)
        .patch(`/api/campaigns/INVALID`)
        .set("Authorization", `Bearer ${userData.sales1.token}`)
        .send({
          name: `${uniquePrefix}_Campaign_Updated`,
          description: `${uniquePrefix}_Campaign_Description_Updated`,
          type: "SOCIAL_MEDIA",
          status: "ACTIVE",
          startDate: makeDate(2),
          endDate: makeDate(1),
          budget: 9999,
        });
      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe("error");
    });
    it("should fail to update a campaign by non admin and owner", async () => {
      const campaign = await createCampaign(
        userData.sales1.token,
        uniquePrefix
      );
      const res = await request(app)
        .patch(`/api/campaigns/${campaign.id}`)
        .set("Authorization", `Bearer ${userData.sales2.token}`)
        .send({
          name: `${uniquePrefix}_Campaign_Updated`,
          description: `${uniquePrefix}_Campaign_Description_Updated`,
          type: "SOCIAL_MEDIA",
          status: "ACTIVE",
          startDate: makeDate(2),
          endDate: makeDate(1),
          budget: 9999,
        });
      expect(res.statusCode).toBe(403);
      expect(res.body.status).toBe("error");
    });
    it("should update a campaign by admin", async () => {
      const campaign = await createCampaign(
        userData.sales1.token,
        uniquePrefix
      );
      const res = await request(app)
        .patch(`/api/campaigns/${campaign.id}`)
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .send({
          name: `${uniquePrefix}_Campaign_Updated`,
          description: `${uniquePrefix}_Campaign_Description_Updated`,
          type: "SOCIAL_MEDIA",
          status: "ACTIVE",
          startDate: makeDate(4),
          endDate: makeDate(5),
          budget: 9999,
        });
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe("success");
    });
    it("should fail to update a campaign by invalid type", async () => {
      const campaign = await createCampaign(
        userData.sales1.token,
        uniquePrefix
      );
      const res = await request(app)
        .patch(`/api/campaigns/${campaign.id}`)
        .set("Authorization", `Bearer ${userData.sales1.token}`)
        .send({
          name: `${uniquePrefix}_Campaign_Updated`,
          description: `${uniquePrefix}_Campaign_Description_Updated`,
          type: "INVALID",
          status: "ACTIVE",
          startDate: makeDate(2),
          endDate: makeDate(1),
          budget: 9999,
        });
      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe("error");
    });
    it("should fail to update a campaign by invalid status", async () => {
      const campaign = await createCampaign(
        userData.sales1.token,
        uniquePrefix
      );
      const res = await request(app)
        .patch(`/api/campaigns/${campaign.id}`)
        .set("Authorization", `Bearer ${userData.sales1.token}`)
        .send({
          name: `${uniquePrefix}_Campaign_Updated`,
          description: `${uniquePrefix}_Campaign_Description_Updated`,
          type: "SOCIAL_MEDIA",
          status: "INVALID",
          startDate: makeDate(2),
          endDate: makeDate(1),
          budget: 9999,
        });
      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe("error");
    });
    it("should fail to update a campaign by invalid start date", async () => {
      const campaign = await createCampaign(
        userData.sales1.token,
        uniquePrefix
      );
      const res = await request(app)
        .patch(`/api/campaigns/${campaign.id}`)
        .set("Authorization", `Bearer ${userData.sales1.token}`)
        .send({
          name: `${uniquePrefix}_Campaign_Updated`,
          description: `${uniquePrefix}_Campaign_Description_Updated`,
          type: "SOCIAL_MEDIA",
          status: "ACTIVE",
          startDate: makeDate(-1),
          endDate: makeDate(1),
          budget: 9999,
        });
      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe("error");
    });
    it("should fail to update a campaign by invalid end date", async () => {
      const campaign = await createCampaign(
        userData.sales1.token,
        uniquePrefix
      );
      const res = await request(app)
        .patch(`/api/campaigns/${campaign.id}`)
        .set("Authorization", `Bearer ${userData.sales1.token}`)
        .send({
          name: `${uniquePrefix}_Campaign_Updated`,
          description: `${uniquePrefix}_Campaign_Description_Updated`,
          type: "SOCIAL_MEDIA",
          status: "ACTIVE",
          startDate: makeDate(1),
          endDate: makeDate(-1),
          budget: 9999,
        });
      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe("error");
    });
    it("should fail to update a campaign with start date greater than end date", async () => {
      const campaign = await createCampaign(
        userData.sales1.token,
        uniquePrefix
      );
      const res = await request(app)
        .patch(`/api/campaigns/${campaign.id}`)
        .set("Authorization", `Bearer ${userData.sales1.token}`)
        .send({
          name: `${uniquePrefix}_Campaign_Updated`,
          description: `${uniquePrefix}_Campaign_Description_Updated`,
          type: "SOCIAL_MEDIA",
          status: "ACTIVE",
          startDate: makeDate(2),
          endDate: makeDate(1),
          budget: 9999,
        });
      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe("error");
    });
  });
  describe("DELETE /api/campaigns/:id", () => {
    it("should delete a campaign (only admin)", async () => {
      const campaign = await createCampaign(
        userData.sales1.token,
        uniquePrefix
      );
      const res = await request(app)
        .delete(`/api/campaigns/${campaign.id}`)
        .set("Authorization", `Bearer ${userData.admin.token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe("success");
    });
    it("should fail to delete a campaign by non admin", async () => {
      const campaign = await createCampaign(
        userData.sales1.token,
        uniquePrefix
      );
      const res = await request(app)
        .delete(`/api/campaigns/${campaign.id}`)
        .set("Authorization", `Bearer ${userData.manager.token}`);
      expect(res.statusCode).toBe(403);
      expect(res.body.status).toBe("error");
    });
    it("should fail to delete a campaign by invalid id", async () => {
      const res = await request(app)
        .delete(`/api/campaigns/INVALID`)
        .set("Authorization", `Bearer ${userData.admin.token}`);
      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe("error");
    });
    it("should fail to delete a campaign by non existing id", async () => {
      const res = await request(app)
        .delete(`/api/campaigns/9999`)
        .set("Authorization", `Bearer ${userData.admin.token}`);
      expect(res.statusCode).toBe(404);
      expect(res.body.status).toBe("error");
    });
  });
});
