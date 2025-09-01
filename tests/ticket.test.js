import {
  setupUsers,
  cleanupUsers,
  cleanupModels,
  createUser,
  createCustomer,
  createTicket,
} from "./testHelpers.js";
import request from "supertest";
import app from "../src/app.js";

describe("Ticket Endpoints", () => {
  let uniquePrefix;
  let userData;

  beforeAll(async () => {
    await cleanupModels("ticket_", ["ticket", "customer"]);
    await cleanupUsers("tk_");
    uniquePrefix = `tk_${Date.now()}`;
    userData = await setupUsers(uniquePrefix);
  });

  beforeEach(async () => {
    uniquePrefix = `ticket_${Date.now()}`;
  });

  describe("POST /api/tickets", () => {
    it("should create a new ticket (only admin and manager)", async () => {
      const user = await createUser(
        userData.admin.token,
        uniquePrefix,
        "SALES"
      );
      const customer = await createCustomer(
        userData.sales2.token,
        uniquePrefix
      );
      expect(customer.id).not.toBeNull();
      const res = await request(app)
        .post("/api/tickets")
        .set("Authorization", `Bearer ${userData.manager.token}`)
        .send({
          assignedToUserId: user.id,
          customerId: customer.id,
          subject: `${uniquePrefix}_Ticket`,
          description: `${uniquePrefix}_Ticket_Description`,
        });
      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe("success");
    });
    it("should fail to create ticket by  non-admin/manager roles", async () => {
      const user = await createUser(
        userData.admin.token,
        uniquePrefix,
        "SALES"
      );
      const customer = await createCustomer(
        userData.sales2.token,
        uniquePrefix
      );
      expect(customer.id).not.toBeNull();
      const res = await request(app)
        .post("/api/tickets")
        .set("Authorization", `Bearer ${userData.sales2.token}`)
        .send({
          assignedToUserId: user.id,
          customerId: customer.id,
          subject: `${uniquePrefix}_Ticket`,
          description: `${uniquePrefix}_Ticket_Description`,
        });
      expect(res.statusCode).toBe(403);
      expect(res.body.message).toBe("Unauthorized");
    });
    it("should fail to create ticket with invalid customer id", async () => {
      const user = await createUser(
        userData.admin.token,
        uniquePrefix,
        "SALES"
      );
      const res = await request(app)
        .post("/api/tickets")
        .set("Authorization", `Bearer ${userData.manager.token}`)
        .send({
          assignedToUserId: user.id,
          customerId: "INVALID",
          subject: `${uniquePrefix}_Ticket`,
          description: `${uniquePrefix}_Ticket_Description`,
        });
      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe("error");
    });
    it("should fail to create ticket with invalid assigned user id", async () => {
      const customer = await createCustomer(
        userData.sales2.token,
        uniquePrefix
      );
      expect(customer.id).not.toBeNull();
      const res = await request(app)
        .post("/api/tickets")
        .set("Authorization", `Bearer ${userData.manager.token}`)
        .send({
          assignedToUserId: "INVALID",
          customerId: customer.id,
          subject: `${uniquePrefix}_Ticket`,
          description: `${uniquePrefix}_Ticket_Description`,
        });
      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe("error");
    });
    it("should fail to creat ticket with non existing customer id", async () => {
      const user = await createUser(
        userData.admin.token,
        uniquePrefix,
        "SALES"
      );
      const res = await request(app)
        .post("/api/tickets")
        .set("Authorization", `Bearer ${userData.manager.token}`)
        .send({
          assignedToUserId: user.id,
          customerId: 99999,
          subject: `${uniquePrefix}_Ticket`,
          description: `${uniquePrefix}_Ticket_Description`,
        });
      expect(res.statusCode).toBe(404);
      expect(res.body.status).toBe("error");
    });
    it("should fail to create ticket with non existing assigned user id", async () => {
      const customer = await createCustomer(
        userData.sales2.token,
        uniquePrefix
      );
      expect(customer.id).not.toBeNull();
      const res = await request(app)
        .post("/api/tickets")
        .set("Authorization", `Bearer ${userData.manager.token}`)
        .send({
          assignedToUserId: 99999,
          customerId: customer.id,
          subject: `${uniquePrefix}_Ticket`,
          description: `${uniquePrefix}_Ticket_Description`,
        });
      expect(res.statusCode).toBe(404);
      expect(res.body.status).toBe("error");
    });
    it("should fail to create ticket with invalid data", async () => {
      const res = await request(app)
        .post("/api/tickets")
        .set("Authorization", `Bearer ${userData.manager.token}`)
        .send({
          assignedToUserId: "INVALID",
          customerId: "INVALID",
          subject: `${uniquePrefix}_Ticket`,
          description: `${uniquePrefix}_Ticket_Description`,
        });
      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe("error");
    });
  });
  describe("GET /api/tickets", () => {
    it("should get all tickets (only admin and manager)", async () => {
      const res = await request(app)
        .get("/api/tickets")
        .set("Authorization", `Bearer ${userData.manager.token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe("success");
    });
    it("should fail to get all tickets (only admin and manager)", async () => {
      const res = await request(app)
        .get("/api/tickets")
        .set("Authorization", `Bearer ${userData.sales1.token}`);
      expect(res.statusCode).toBe(403);
      expect(res.body.status).toBe("error");
    });
    it("should get all tickets by status", async () => {
      const res = await request(app)
        .get("/api/tickets?status=OPEN")
        .set("Authorization", `Bearer ${userData.manager.token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe("success");
    });
    it("should fail to get all tickets by invalid status", async () => {
      const res = await request(app)
        .get("/api/tickets?status=INVALID")
        .set("Authorization", `Bearer ${userData.manager.token}`);
      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe("error");
    });
    it("should get all my tickets", async () => {
      const res = await request(app)
        .get("/api/tickets/my-tickets")
        .set("Authorization", `Bearer ${userData.sales1.token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe("success");
    });
    it("should get all tickets by creator id", async () => {
      const res = await request(app)
        .get(`/api/tickets?creator=${userData.sales1.id}`)
        .set("Authorization", `Bearer ${userData.manager.token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe("success");
    });
  });
  describe("PATCH /api/tickets/:id", () => {
    it("should update a ticket (only admin and manager)", async () => {
      const customer = await createCustomer(
        userData.sales2.token,
        uniquePrefix
      );
      const ticket = await createTicket(
        userData.manager.token,
        uniquePrefix,
        userData.sales1.id,
        customer.id
      );
      expect(ticket.id).not.toBeNull();
      const res = await request(app)
        .patch(`/api/tickets/${ticket.id}`)
        .set("Authorization", `Bearer ${userData.manager.token}`)
        .send({
          subject: `${uniquePrefix}_Ticket_Updated`,
          description: `${uniquePrefix}_Ticket_Description_Updated`,
          status: "CLOSED",
        });
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.data.subject).toBe(`${uniquePrefix}_Ticket_Updated`);
      expect(res.body.data.description).toBe(
        `${uniquePrefix}_Ticket_Description_Updated`
      );
      expect(res.body.data.status).toBe("CLOSED");
    });
    it("should fail to update a ticket (only admin and manager)", async () => {
      const customer = await createCustomer(
        userData.sales2.token,
        uniquePrefix
      );
      const ticket = await createTicket(
        userData.manager.token,
        uniquePrefix,
        userData.sales1.id,
        customer.id
      );
      const res = await request(app)
        .patch(`/api/tickets/${ticket.id}`)
        .set("Authorization", `Bearer ${userData.sales1.token}`)
        .send({
          subject: `${uniquePrefix}_Ticket_Updated`,
          description: `${uniquePrefix}_Ticket_Description_Updated`,
          status: "CLOSED",
        });
      expect(res.statusCode).toBe(403);
      expect(res.body.status).toBe("error");
    });
    it("should fail to update a non existing ticket", async () => {
      const res = await request(app)
        .patch(`/api/tickets/999999`)
        .set("Authorization", `Bearer ${userData.manager.token}`)
        .send({
          subject: `${uniquePrefix}_Ticket_Updated`,
          description: `${uniquePrefix}_Ticket_Description_Updated`,
          status: "CLOSED",
        });
      expect(res.statusCode).toBe(404);
      expect(res.body.status).toBe("error");
    });
    it("should fail to update customer id ticket (not allowed)", async () => {
      const customer = await createCustomer(
        userData.sales2.token,
        uniquePrefix
      );
      const ticket = await createTicket(
        userData.manager.token,
        uniquePrefix,
        userData.sales1.id,
        customer.id
      );
      const res = await request(app)
        .patch(`/api/tickets/${ticket.id}`)
        .set("Authorization", `Bearer ${userData.manager.token}`)
        .send({
          customerId: customer.id,
        });
      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe("error");
    });
    it("should fail to update ticket with invalid assigned user id", async () => {
      const customer = await createCustomer(
        userData.sales2.token,
        uniquePrefix
      );
      const ticket = await createTicket(
        userData.manager.token,
        uniquePrefix,
        userData.sales1.id,
        customer.id
      );
      const res = await request(app)
        .patch(`/api/tickets/${ticket.id}`)
        .set("Authorization", `Bearer ${userData.manager.token}`)
        .send({
          assignedToUserId: "INVALID",
        });
      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe("error");
    });
    it("should fail to update ticket with invalid status", async () => {
      const customer = await createCustomer(
        userData.sales2.token,
        uniquePrefix
      );
      const ticket = await createTicket(
        userData.manager.token,
        uniquePrefix,
        userData.sales1.id,
        customer.id
      );
      const res = await request(app)
        .patch(`/api/tickets/${ticket.id}`)
        .set("Authorization", `Bearer ${userData.manager.token}`)
        .send({
          status: "INVALID",
        });
      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe("error");
    });
    it("should fail to update ticket non existing assigned user id", async () => {
      const customer = await createCustomer(
        userData.sales2.token,
        uniquePrefix
      );
      const ticket = await createTicket(
        userData.manager.token,
        uniquePrefix,
        userData.sales1.id,
        customer.id
      );
      const res = await request(app)
        .patch(`/api/tickets/${ticket.id}`)
        .set("Authorization", `Bearer ${userData.manager.token}`)
        .send({
          assignedToUserId: 999999,
        });
      expect(res.statusCode).toBe(404);
      expect(res.body.status).toBe("error");
    });
  });
  describe("DELETE /api/tickets/:id", () => {
    it("should delete a ticket (only admin and manager)", async () => {
      const customer = await createCustomer(
        userData.sales2.token,
        uniquePrefix
      );
      const ticket = await createTicket(
        userData.manager.token,
        uniquePrefix,
        userData.sales1.id,
        customer.id
      );
      expect(ticket.id).not.toBeNull();
      const res = await request(app)
        .delete(`/api/tickets/${ticket.id}`)
        .set("Authorization", `Bearer ${userData.admin.token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe("success");
    });
    it("should fail to delete a ticket (only admin)", async () => {
      const customer = await createCustomer(
        userData.sales2.token,
        uniquePrefix
      );
      const ticket = await createTicket(
        userData.manager.token,
        uniquePrefix,
        userData.sales1.id,
        customer.id
      );
      const res = await request(app)
        .delete(`/api/tickets/${ticket.id}`)
        .set("Authorization", `Bearer ${userData.manager.token}`);
      expect(res.statusCode).toBe(403);
      expect(res.body.status).toBe("error");
    });
    it("should fail to delete a non existing ticket", async () => {
      const res = await request(app)
        .delete(`/api/tickets/999999`)
        .set("Authorization", `Bearer ${userData.admin.token}`);
      expect(res.statusCode).toBe(404);
      expect(res.body.status).toBe("error");
    });
    it("should fail to delete ticket with invalid id", async () => {
      const res = await request(app)
        .delete(`/api/tickets/INVALID`)
        .set("Authorization", `Bearer ${userData.admin.token}`);
      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe("error");
    });
  });
});
