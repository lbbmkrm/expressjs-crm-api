import request from "supertest";
import app from "./../src/app.js";
import {
  setupUsers,
  cleanupUsers,
  cleanupModels,
  createCustomer,
  createContact,
} from "./testHelpers.js";

describe("Contact Endpoints", () => {
  let uniquePrefix;
  let userData;

  beforeAll(async () => {
    await cleanupModels("contact_", ["contact", "customer"]);
    await cleanupUsers("cnt_");
    uniquePrefix = `cnt_${Date.now()}`;
    userData = await setupUsers(uniquePrefix);
  });

  beforeEach(() => {
    uniquePrefix = `contact_${Date.now()}`;
  });

  describe("POST /api/contacts", () => {
    it("should create a new contact", async () => {
      const customer = await createCustomer(
        userData.sales1.token,
        uniquePrefix
      );
      const response = await request(app)
        .post("/api/contacts")
        .set("Authorization", `Bearer ${userData.sales1.token}`)
        .send({
          customerId: customer.id,
          firstName: `${uniquePrefix}_First`,
          lastName: `${uniquePrefix}_Last`,
          email: `${uniquePrefix}_cont@example.com`,
          phone: "1234567890",
          position: "Manager",
        });
      expect(response.statusCode).toBe(201);
      expect(response.body.status).toBe("success");
    });

    it("should fail to create contact by VIEWER", async () => {
      const customer = await createCustomer(
        userData.sales1.token,
        uniquePrefix
      );
      const response = await request(app)
        .post("/api/contacts")
        .set("Authorization", `Bearer ${userData.viewer.token}`)
        .send({
          customerId: customer.id,
          firstName: `${uniquePrefix}_First`,
          lastName: `${uniquePrefix}_Last`,
          email: `${uniquePrefix}_cont@example.com`,
          phone: "1234567890",
          position: "Manager",
        });
      expect(response.statusCode).toBe(403);
    });

    it("should fail to create contact with duplicate email", async () => {
      const customer = await createCustomer(
        userData.sales1.token,
        uniquePrefix
      );
      const email = `${uniquePrefix}_cont@example.com`;
      const response1 = await request(app)
        .post("/api/contacts")
        .set("Authorization", `Bearer ${userData.sales1.token}`)
        .send({
          customerId: customer.id,
          firstName: `${uniquePrefix}_First`,
          lastName: `${uniquePrefix}_Last`,
          email,
          phone: "1234567890",
          position: "Manager",
        });
      expect(response1.statusCode).toBe(201);
      const response2 = await request(app)
        .post("/api/contacts")
        .set("Authorization", `Bearer ${userData.sales1.token}`)
        .send({
          customerId: customer.id,
          firstName: `${uniquePrefix}_First2`,
          lastName: `${uniquePrefix}_Last2`,
          email,
          phone: "1234567890",
          position: "Manager2",
        });
      expect(response2.statusCode).toBe(400);
      expect(response2.body.status).toBe("error");
    });

    it("should fail to create contact with invalid data", async () => {
      const customer = await createCustomer(
        userData.sales1.token,
        uniquePrefix
      );
      const response = await request(app)
        .post("/api/contacts")
        .set("Authorization", `Bearer ${userData.sales1.token}`)
        .send({
          customerId: customer.id,
          firstName: "",
          email: "invalid-email",
          phone: "",
        });
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error");
    });
  });

  describe("GET /api/contacts", () => {
    it("should get all contacts for all roles", async () => {
      const response = await request(app)
        .get("/api/contacts")
        .set("Authorization", `Bearer ${userData.sales1.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
    });

    it("should get a contact by ID", async () => {
      const customer = await createCustomer(
        userData.sales2.token,
        uniquePrefix
      );
      const contact = await createContact(
        userData.sales2.token,
        uniquePrefix,
        customer.id
      );
      const response = await request(app)
        .get(`/api/contacts/${contact.id}`)
        .set("Authorization", `Bearer ${userData.sales2.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data.id).toBe(contact.id);
    });

    it("should fail to get contact with invalid id", async () => {
      const response = await request(app)
        .get("/api/contacts/99999")
        .set("Authorization", `Bearer ${userData.sales2.token}`);
      expect(response.statusCode).toBe(404);
      expect(response.body.status).toBe("error");
    });
  });

  describe("PATCH /api/contacts/:id", () => {
    it("should update a contact", async () => {
      const customer = await createCustomer(
        userData.sales2.token,
        uniquePrefix
      );
      const contact = await createContact(
        userData.sales1.token,
        uniquePrefix,
        customer.id
      );
      expect(contact.firstName).toBe(`${uniquePrefix}_First`);
      const response = await request(app)
        .patch(`/api/contacts/${contact.id}`)
        .set("Authorization", `Bearer ${userData.sales1.token}`)
        .send({
          firstName: `${uniquePrefix}_First_Updated`,
        });
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data.firstName).toBe(
        `${uniquePrefix}_First_Updated`
      );
    });

    it("should fail to update contact with invalid id", async () => {
      const response = await request(app)
        .patch("/api/contacts/99999")
        .set("Authorization", `Bearer ${userData.sales1.token}`)
        .send({
          firstName: `${uniquePrefix}_First_Updated`,
        });
      expect(response.statusCode).toBe(404);
      expect(response.body.status).toBe("error");
    });

    it("should update a contact by ADMIN", async () => {
      const customer = await createCustomer(
        userData.sales2.token,
        uniquePrefix
      );
      const contact = await createContact(
        userData.sales1.token,
        uniquePrefix,
        customer.id
      );
      expect(contact.firstName).toBe(`${uniquePrefix}_First`);
      const response = await request(app)
        .patch(`/api/contacts/${contact.id}`)
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .send({
          firstName: `${uniquePrefix}_First_Updated`,
        });
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data.firstName).toBe(
        `${uniquePrefix}_First_Updated`
      );
    });

    it("should fail to update a non-owned contact", async () => {
      const customer = await createCustomer(
        userData.sales2.token,
        uniquePrefix
      );
      const contact = await createContact(
        userData.sales1.token,
        uniquePrefix,
        customer.id
      );
      expect(contact.createdByUserId).not.toBe(userData.sales2.id);
      const response = await request(app)
        .patch(`/api/contacts/${contact.id}`)
        .set("Authorization", `Bearer ${userData.sales2.token}`)
        .send({
          firstName: `${uniquePrefix}_First_Updated`,
        });
      expect(response.statusCode).toBe(403);
      expect(response.body.status).toBe("error");
    });
  });

  describe("DELETE /api/contacts/:id", () => {
    it("should delete a contact", async () => {
      const customer = await createCustomer(userData.admin.token, uniquePrefix);
      const contact = await createContact(
        userData.sales1.token,
        uniquePrefix,
        customer.id
      );
      expect(contact.firstName).toBe(`${uniquePrefix}_First`);
      const response = await request(app)
        .delete(`/api/contacts/${contact.id}`)
        .set("Authorization", `Bearer ${userData.sales1.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
    });

    it("should fail to delete contact with invalid id", async () => {
      const response = await request(app)
        .delete("/api/contacts/99999")
        .set("Authorization", `Bearer ${userData.sales1.token}`);
      expect(response.statusCode).toBe(404);
      expect(response.body.status).toBe("error");
    });

    it("should delete a contact by ADMIN", async () => {
      const customer = await createCustomer(
        userData.sales2.token,
        uniquePrefix
      );
      const contact = await createContact(
        userData.sales1.token,
        uniquePrefix,
        customer.id
      );
      expect(contact.firstName).toBe(`${uniquePrefix}_First`);
      const response = await request(app)
        .delete(`/api/contacts/${contact.id}`)
        .set("Authorization", `Bearer ${userData.admin.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
    });

    it("should fail to delete a non-owned contact", async () => {
      const customer = await createCustomer(
        userData.sales2.token,
        uniquePrefix
      );
      const contact = await createContact(
        userData.sales1.token,
        uniquePrefix,
        customer.id
      );
      expect(contact.createdByUserId).not.toBe(userData.sales2.id);
      const response = await request(app)
        .delete(`/api/contacts/${contact.id}`)
        .set("Authorization", `Bearer ${userData.sales2.token}`);
      expect(response.statusCode).toBe(403);
      expect(response.body.status).toBe("error");
    });
  });

  describe("GET contact relations", () => {
    it("should get contact activities for admin and manager", async () => {
      const customer = await createCustomer(
        userData.sales1.token,
        uniquePrefix
      );
      const contact = await createContact(
        userData.sales1.token,
        uniquePrefix,
        customer.id
      );
      const response = await request(app)
        .get(`/api/contacts/${contact.id}/activities`)
        .set("Authorization", `Bearer ${userData.admin.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data).toBeDefined();
    });

    it("should get contact notes for admin and manager", async () => {
      const customer = await createCustomer(
        userData.sales2.token,
        uniquePrefix
      );
      const contact = await createContact(
        userData.sales1.token,
        uniquePrefix,
        customer.id
      );
      const response = await request(app)
        .get(`/api/contacts/${contact.id}/notes`)
        .set("Authorization", `Bearer ${userData.admin.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data).toBeDefined();
    });
  });
});
