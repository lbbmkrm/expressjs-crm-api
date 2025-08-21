import app from "../src/app";
import request from "supertest";
import path from "path";
import fsPromises from "fs/promises";
import {
  setupUsers,
  cleanupModels,
  cleanupUsers,
  createCustomer,
  createContact,
  createLead,
  createOpportunity,
  createCampaign,
  createSale,
  createProduct,
  createFile,
  createDocument,
} from "./testHelpers.js";

describe("Document Endpoints", () => {
  let uniquePrefix;
  let userData;

  beforeAll(async () => {
    await cleanupModels("document_", [
      "document",
      "sale",
      "product",
      "contact",
      "campaign",
      "opportunity",
      "lead",
      "customer",
    ]);
    await cleanupUsers("doc_");
    uniquePrefix = `doc_${Date.now()}`;
    userData = await setupUsers(uniquePrefix);
  });

  beforeEach(async () => {
    uniquePrefix = `document_${Date.now()}`;
  });

  afterAll(async () => {
    const testUploadDir = path.join(
      process.cwd(),
      "uploads",
      "documents",
      "tests"
    );
    try {
      const files = await fsPromises.readdir(testUploadDir);
      for (const file of files) {
        const filePath = path.join(testUploadDir, file);
        await fsPromises.unlink(filePath);
      }
    } catch (err) {
      console.warn("Error cleaning up test files", err.message);
    }
  });

  describe("POST /api/documents", () => {
    it("should create a document (all roles expcept viewer)", async () => {
      const filePath = await createFile(uniquePrefix, "pdf");
      const response = await request(app)
        .post("/api/documents?isTesting=true")
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .set("Content-Type", "multipart/form-data")
        .field("documentType", "PROPOSAL")
        .attach("file", filePath);
      expect(response.status).toBe(201);
    });
    it("should create a document with customer id", async () => {
      const customer = await createCustomer(
        userData.sales1.token,
        uniquePrefix
      );
      expect(customer.id).not.toBeNull();
      const filePath = await createFile(uniquePrefix, "pdf");
      const response = await request(app)
        .post("/api/documents?isTesting=true")
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .set("Content-Type", "multipart/form-data")
        .field("documentType", "PROPOSAL")
        .field("customerId", customer.id)
        .attach("file", filePath);
      expect(response.status).toBe(201);
    });
    it("should create a document with contact id", async () => {
      const customer = await createCustomer(
        userData.sales1.token,
        uniquePrefix
      );
      const contact = await createContact(
        userData.sales1.token,
        uniquePrefix,
        customer.id
      );
      expect(contact.id).not.toBeNull();
      const filePath = await createFile(uniquePrefix, "pdf");
      const response = await request(app)
        .post("/api/documents?isTesting=true")
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .set("Content-Type", "multipart/form-data")
        .field("documentType", "PROPOSAL")
        .field("contactId", contact.id)
        .attach("file", filePath);
      expect(response.status).toBe(201);
    });
    it("should create a document with lead id", async () => {
      const customer = await createCustomer(
        userData.sales1.token,
        uniquePrefix
      );
      const lead = await createLead(
        userData.sales1.token,
        uniquePrefix,
        customer.id
      );
      expect(lead.id).not.toBeNull();
      const filePath = await createFile(uniquePrefix, "pdf");
      const response = await request(app)
        .post("/api/documents?isTesting=true")
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .set("Content-Type", "multipart/form-data")
        .field("documentType", "PROPOSAL")
        .field("leadId", lead.id)
        .attach("file", filePath);
      expect(response.status).toBe(201);
    });
    it("should create a document with opportunity id", async () => {
      const customer = await createCustomer(
        userData.sales1.token,
        uniquePrefix
      );
      const opportunity = await createOpportunity(
        userData.sales1.token,
        uniquePrefix,
        customer.id
      );
      expect(opportunity.id).not.toBeNull();
      const filePath = await createFile(uniquePrefix, "pdf");
      const response = await request(app)
        .post("/api/documents?isTesting=true")
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .set("Content-Type", "multipart/form-data")
        .field("documentType", "PROPOSAL")
        .field("opportunityId", opportunity.id)
        .attach("file", filePath);
      expect(response.status).toBe(201);
    });
    it("should create a document with campaign id", async () => {
      const customer = await createCustomer(
        userData.sales1.token,
        uniquePrefix
      );
      const campaign = await createCampaign(
        userData.sales1.token,
        uniquePrefix,
        customer.id
      );
      expect(campaign.id).not.toBeNull();
      const filePath = await createFile(uniquePrefix, "pdf");
      const response = await request(app)
        .post("/api/documents?isTesting=true")
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .set("Content-Type", "multipart/form-data")
        .field("documentType", "PROPOSAL")
        .field("campaignId", campaign.id)
        .attach("file", filePath);
      expect(response.status).toBe(201);
    });
    it("should create a document with sale id", async () => {
      const customer = await createCustomer(
        userData.sales1.token,
        uniquePrefix
      );
      const product = await createProduct(userData.admin.token, uniquePrefix);
      const sale = await createSale(
        userData.sales1.token,
        customer.id,
        product.id
      );
      expect(sale.id).not.toBeNull();
      const filePath = await createFile(uniquePrefix, "pdf");
      const response = await request(app)
        .post("/api/documents?isTesting=true")
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .set("Content-Type", "multipart/form-data")
        .field("documentType", "PROPOSAL")
        .field("saleId", sale.id)
        .attach("file", filePath);
      expect(response.status).toBe(201);
    });
    it("should fail to create a document by viewer role", async () => {
      const filePath = await createFile(uniquePrefix, "pdf");
      const response = await request(app)
        .post("/api/documents?isTesting=true")
        .set("Authorization", `Bearer ${userData.viewer.token}`)
        .set("Content-Type", "multipart/form-data")
        .field("documentType", "PROPOSAL")
        .attach("file", filePath);
      expect(response.status).toBe(403);
    });
    it("should fail to create a document without file", async () => {
      const response = await request(app)
        .post("/api/documents?isTesting=true")
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .set("Content-Type", "multipart/form-data")
        .field("documentType", "PROPOSAL");
      expect(response.status).toBe(400);
    });
    it("should fail to create a document with invalid document type", async () => {
      const filePath = await createFile(uniquePrefix, "pdf");
      const response = await request(app)
        .post("/api/documents?isTesting=true")
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .set("Content-Type", "multipart/form-data")
        .field("documentType", "INVALID")
        .attach("file", filePath);
      expect(response.status).toBe(400);
    });
    it("should fail to create a document with invalid file", async () => {
      const filePath = await createFile(uniquePrefix, ".invalid");
      const response = await request(app)
        .post("/api/documents?isTesting=true")
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .set("Content-Type", "multipart/form-data")
        .field("documentType", "PROPOSAL")
        .attach("file", filePath);
      expect(response.status).toBe(400);
    });
    it("should fail to create a document with invalid customer id", async () => {
      const filePath = await createFile(uniquePrefix, "pdf");
      const response = await request(app)
        .post("/api/documents?isTesting=true")
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .set("Content-Type", "multipart/form-data")
        .field("documentType", "PROPOSAL")
        .field("customerId", "INVALID")
        .attach("file", filePath);
      expect(response.status).toBe(400);
    });
    it("should fail to create a document with invalid lead id", async () => {
      const filePath = await createFile(uniquePrefix, "pdf");
      const response = await request(app)
        .post("/api/documents?isTesting=true")
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .set("Content-Type", "multipart/form-data")
        .field("documentType", "PROPOSAL")
        .field("leadId", "INVALID")
        .attach("file", filePath);
      expect(response.status).toBe(400);
    });
    it("should fail to create a document with invalid contact id", async () => {
      const filePath = await createFile(uniquePrefix, "pdf");
      const response = await request(app)
        .post("/api/documents?isTesting=true")
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .set("Content-Type", "multipart/form-data")
        .field("documentType", "PROPOSAL")
        .field("contactId", "INVALID")
        .attach("file", filePath);
      expect(response.status).toBe(400);
    });
    it("should fail to create a document with invalid opportunity id", async () => {
      const filePath = await createFile(uniquePrefix, "pdf");
      const response = await request(app)
        .post("/api/documents?isTesting=true")
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .set("Content-Type", "multipart/form-data")
        .field("documentType", "PROPOSAL")
        .field("opportunityId", "INVALID")
        .attach("file", filePath);
      expect(response.status).toBe(400);
    });
    it("should fail to create a document with invalid campaign id", async () => {
      const filePath = await createFile(uniquePrefix, "pdf");
      const response = await request(app)
        .post("/api/documents?isTesting=true")
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .set("Content-Type", "multipart/form-data")
        .field("documentType", "PROPOSAL")
        .field("campaignId", "INVALID")
        .attach("file", filePath);
      expect(response.status).toBe(400);
    });
    it("should fail to create a document with invalid sale id", async () => {
      const filePath = await createFile(uniquePrefix, "pdf");
      const response = await request(app)
        .post("/api/documents?isTesting=true")
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .set("Content-Type", "multipart/form-data")
        .field("documentType", "PROPOSAL")
        .field("saleId", "INVALID")
        .attach("file", filePath);
      expect(response.status).toBe(400);
    });
    it("should fail to create a document with non existing customer id", async () => {
      const filePath = await createFile(uniquePrefix, "pdf");
      const response = await request(app)
        .post("/api/documents?isTesting=true")
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .set("Content-Type", "multipart/form-data")
        .field("documentType", "PROPOSAL")
        .field("customerId", "9999")
        .attach("file", filePath);
      expect(response.status).toBe(404);
    });
    it("should fail to create a document with non existing lead id", async () => {
      const filePath = await createFile(uniquePrefix, "pdf");
      const response = await request(app)
        .post("/api/documents?isTesting=true")
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .set("Content-Type", "multipart/form-data")
        .field("documentType", "PROPOSAL")
        .field("leadId", "9999")
        .attach("file", filePath);
      expect(response.status).toBe(404);
    });
    it("should fail to create a document with non existing contact id", async () => {
      const filePath = await createFile(uniquePrefix, "pdf");
      const response = await request(app)
        .post("/api/documents?isTesting=true")
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .set("Content-Type", "multipart/form-data")
        .field("documentType", "PROPOSAL")
        .field("contactId", "9999")
        .attach("file", filePath);
      expect(response.status).toBe(404);
    });
    it("should fail to create a document with non existing opportunity id", async () => {
      const filePath = await createFile(uniquePrefix, "pdf");
      const response = await request(app)
        .post("/api/documents?isTesting=true")
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .set("Content-Type", "multipart/form-data")
        .field("documentType", "PROPOSAL")
        .field("opportunityId", "9999")
        .attach("file", filePath);
      expect(response.status).toBe(404);
    });
    it("should fail to create a document with non existing campaign id", async () => {
      const filePath = await createFile(uniquePrefix, "pdf");
      const response = await request(app)
        .post("/api/documents?isTesting=true")
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .set("Content-Type", "multipart/form-data")
        .field("documentType", "PROPOSAL")
        .field("campaignId", "9999")
        .attach("file", filePath);
      expect(response.status).toBe(404);
    });
    it("should fail to create a document with non existing sale id", async () => {
      const filePath = await createFile(uniquePrefix, "pdf");
      const response = await request(app)
        .post("/api/documents?isTesting=true")
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .set("Content-Type", "multipart/form-data")
        .field("documentType", "PROPOSAL")
        .field("saleId", "9999")
        .attach("file", filePath);
      expect(response.status).toBe(404);
    });
  });
  describe("GET /api/documents", () => {
    it("should get all documents (only admin)", async () => {
      const response = await request(app)
        .get("/api/documents")
        .set("Authorization", `Bearer ${userData.admin.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
    });
    it("should get all documents by document type (only admin)", async () => {
      const response = await request(app)
        .get("/api/documents?documentType=PROPOSAL")
        .set("Authorization", `Bearer ${userData.admin.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
    });
    it("should get document by id (admin, manager and owner)", async () => {
      const file = await createFile(uniquePrefix, "pdf");
      const document = await createDocument(userData.admin.token, file);
      const response = await request(app)
        .get(`/api/documents/${document.id}`)
        .set("Authorization", `Bearer ${userData.admin.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
    });
    it("should fail to get all documents by non admin", async () => {
      const response = await request(app)
        .get("/api/documents")
        .set("Authorization", `Bearer ${userData.manager.token}`);
      expect(response.statusCode).toBe(403);
      expect(response.body.status).toBe("error");
    });
    it("should failt to get all documents by invalid document type", async () => {
      const response = await request(app)
        .get("/api/documents?documentType=INVALID")
        .set("Authorization", `Bearer ${userData.admin.token}`);
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error");
    });
    it("should fail to get document by invalid id", async () => {
      const response = await request(app)
        .get(`/api/documents/INVALID`)
        .set("Authorization", `Bearer ${userData.admin.token}`);
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error");
    });
    it("should fail to get document by non existing id", async () => {
      const response = await request(app)
        .get(`/api/documents/9999`)
        .set("Authorization", `Bearer ${userData.admin.token}`);
      expect(response.statusCode).toBe(404);
      expect(response.body.status).toBe("error");
    });
    it("should fail to get document by non owner user", async () => {
      const file = await createFile(uniquePrefix, "pdf");
      const document = await createDocument(userData.sales1.token, file);
      const response = await request(app)
        .get(`/api/documents/${document.id}`)
        .set("Authorization", `Bearer ${userData.sales2.token}`);
      expect(response.statusCode).toBe(403);
      expect(response.body.status).toBe("error");
    });
    it("should fail to get document by viewer role", async () => {
      const file = await createFile(uniquePrefix, "pdf");
      const document = await createDocument(userData.sales1.token, file);
      const response = await request(app)
        .get(`/api/documents/${document.id}`)
        .set("Authorization", `Bearer ${userData.viewer.token}`);
      expect(response.statusCode).toBe(403);
      expect(response.body.status).toBe("error");
    });
  });
  describe("PATCH /api/documents/:id", () => {
    it("should update a document (admin, manager and owner)", async () => {
      const file = await createFile(uniquePrefix, "pdf");
      const document = await createDocument(
        userData.admin.token,
        file,
        "PROPOSAL"
      );
      expect(document.documentType).toBe("PROPOSAL");
      expect(document.customerId).toBeNull();
      const customer = await createCustomer(
        userData.sales2.token,
        uniquePrefix
      );
      const response = await request(app)
        .patch(`/api/documents/${document.id}?isTesting=true`)
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .set("Content-Type", "multipart/form-data")
        .field("documentType", "QUOTE")
        .field("customerId", customer.id)
        .attach("file", file);

      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data.documentType).toBe("QUOTE");
      expect(response.body.data.customerId).toBe(customer.id);
    });
    it("should update a document's metadata without uploading a new file", async () => {
      const file = await createFile(uniquePrefix, "pdf");
      const document = await createDocument(
        userData.admin.token,
        file,
        "PROPOSAL"
      );
      const customer = await createCustomer(
        userData.sales2.token,
        uniquePrefix
      );

      const response = await request(app)
        .patch(`/api/documents/${document.id}?isTesting=true`)
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .set("Content-Type", "multipart/form-data")
        .field("documentType", "INVOICE")
        .field("customerId", customer.id);

      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data.documentType).toBe("INVOICE");
      expect(response.body.data.customerId).toBe(customer.id);
      expect(response.body.data.path).toBe(document.path);
    });
    it("should fail to update a document by non owner user", async () => {
      const file = await createFile(uniquePrefix, "pdf");
      const document = await createDocument(
        userData.sales1.token,
        file,
        "PROPOSAL"
      );
      const response = await request(app)
        .patch(`/api/documents/${document.id}?isTesting=true`)
        .set("Authorization", `Bearer ${userData.sales2.token}`)
        .set("Content-Type", "multipart/form-data")
        .field("documentType", "QUOTE")
        .attach("file", file);
      expect(response.statusCode).toBe(403);
      expect(response.body.status).toBe("error");
    });
    it("should fail to update a document with invalid document id", async () => {
      const filePath = await createFile(uniquePrefix, "pdf");
      const response = await request(app)
        .patch(`/api/documents/INVALID?isTesting=true`)
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .set("Content-Type", "multipart/form-data")
        .field("documentType", "QUOTE")
        .attach("file", filePath);
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error");
    });
    it("should fail to update a document with non existing document id", async () => {
      const filePath = await createFile(uniquePrefix, "pdf");
      const response = await request(app)
        .patch(`/api/documents/9999?isTesting=true`)
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .set("Content-Type", "multipart/form-data")
        .field("documentType", "QUOTE")
        .attach("file", filePath);
      expect(response.statusCode).toBe(404);
      expect(response.body.status).toBe("error");
    });
    it("should fail to update a document with invalid document type", async () => {
      const filePath = await createFile(uniquePrefix, "pdf");
      const document = await createDocument(
        userData.sales1.token,
        filePath,
        "PROPOSAL"
      );
      const response = await request(app)
        .patch(`/api/documents/${document.id}?isTesting=true`)
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .set("Content-Type", "multipart/form-data")
        .field("documentType", "INVALID")
        .attach("file", filePath);
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error");
    });
    it("should fail to update a document with invalid file", async () => {
      const validFilePath = await createFile(uniquePrefix, "pdf");
      const document = await createDocument(
        userData.sales1.token,
        validFilePath,
        "PROPOSAL"
      );

      const invalidFilePath = await createFile(uniquePrefix, "invalid");
      const response = await request(app)
        .patch(`/api/documents/${document.id}?isTesting=true`)
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .set("Content-Type", "multipart/form-data")
        .field("documentType", "QUOTE")
        .attach("file", invalidFilePath);
      expect(response.statusCode).toBe(500);
      expect(response.body.status).toBe("error");
    });
    it("should fail to update a document with invalid customer id", async () => {
      const filePath = await createFile(uniquePrefix, "pdf");
      const document = await createDocument(
        userData.sales1.token,
        filePath,
        "PROPOSAL"
      );
      const response = await request(app)
        .patch(`/api/documents/${document.id}?isTesting=true`)
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .set("Content-Type", "multipart/form-data")
        .field("documentType", "QUOTE")
        .field("customerId", "INVALID")
        .attach("file", filePath);
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error");
    });
    it("should fail to update a document with invalid contact id", async () => {
      const filePath = await createFile(uniquePrefix, "pdf");
      const document = await createDocument(
        userData.sales1.token,
        filePath,
        "PROPOSAL"
      );
      const response = await request(app)
        .patch(`/api/documents/${document.id}?isTesting=true`)
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .set("Content-Type", "multipart/form-data")
        .field("documentType", "QUOTE")
        .field("contactId", "INVALID")
        .attach("file", filePath);
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error");
    });
    it("should fail to update a document with invalid lead id", async () => {
      const filePath = await createFile(uniquePrefix, "pdf");
      const document = await createDocument(
        userData.sales1.token,
        filePath,
        "PROPOSAL"
      );
      const response = await request(app)
        .patch(`/api/documents/${document.id}?isTesting=true`)
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .set("Content-Type", "multipart/form-data")
        .field("documentType", "QUOTE")
        .field("leadId", "INVALID")
        .attach("file", filePath);
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error");
    });
    it("should fail to update a document with invalid opportunity id", async () => {
      const filePath = await createFile(uniquePrefix, "pdf");
      const document = await createDocument(
        userData.sales1.token,
        filePath,
        "PROPOSAL"
      );
      const response = await request(app)
        .patch(`/api/documents/${document.id}?isTesting=true`)
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .set("Content-Type", "multipart/form-data")
        .field("documentType", "QUOTE")
        .field("opportunityId", "INVALID")
        .attach("file", filePath);
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error");
    });
    it("should fail to update a document with invalid campaign id", async () => {
      const filePath = await createFile(uniquePrefix, "pdf");
      const document = await createDocument(
        userData.sales1.token,
        filePath,
        "PROPOSAL"
      );
      const response = await request(app)
        .patch(`/api/documents/${document.id}?isTesting=true`)
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .set("Content-Type", "multipart/form-data")
        .field("documentType", "QUOTE")
        .field("campaignId", "INVALID")
        .attach("file", filePath);
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error");
    });
    it("should fail to update a document with invalid sale id", async () => {
      const filePath = await createFile(uniquePrefix, "pdf");
      const document = await createDocument(
        userData.sales1.token,
        filePath,
        "PROPOSAL"
      );
      const response = await request(app)
        .patch(`/api/documents/${document.id}?isTesting=true`)
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .set("Content-Type", "multipart/form-data")
        .field("documentType", "QUOTE")
        .field("saleId", "INVALID")
        .attach("file", filePath);
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error");
    });
    it("should fail to update a document with non existing customer id", async () => {
      const filePath = await createFile(uniquePrefix, "pdf");
      const document = await createDocument(
        userData.sales1.token,
        filePath,
        "PROPOSAL"
      );
      const response = await request(app)
        .patch(`/api/documents/${document.id}?isTesting=true`)
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .set("Content-Type", "multipart/form-data")
        .field("documentType", "QUOTE")
        .field("customerId", 9999)
        .attach("file", filePath);
      expect(response.statusCode).toBe(404);
      expect(response.body.status).toBe("error");
    });
    it("should fail to update a document with non existing contact id", async () => {
      const filePath = await createFile(uniquePrefix, "pdf");
      const document = await createDocument(
        userData.sales1.token,
        filePath,
        "PROPOSAL"
      );
      const response = await request(app)
        .patch(`/api/documents/${document.id}?isTesting=true`)
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .set("Content-Type", "multipart/form-data")
        .field("documentType", "QUOTE")
        .field("contactId", 9999)
        .attach("file", filePath);
      expect(response.statusCode).toBe(404);
      expect(response.body.status).toBe("error");
    });
    it("should fail to update a document with non existing lead id", async () => {
      const filePath = await createFile(uniquePrefix, "pdf");
      const document = await createDocument(
        userData.sales1.token,
        filePath,
        "PROPOSAL"
      );
      const response = await request(app)
        .patch(`/api/documents/${document.id}?isTesting=true`)
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .set("Content-Type", "multipart/form-data")
        .field("documentType", "QUOTE")
        .field("leadId", 9999)
        .attach("file", filePath);
      expect(response.statusCode).toBe(404);
      expect(response.body.status).toBe("error");
    });
    it("should fail to update a document with non existing opportunity id", async () => {
      const filePath = await createFile(uniquePrefix, "pdf");
      const document = await createDocument(
        userData.sales1.token,
        filePath,
        "PROPOSAL"
      );
      const response = await request(app)
        .patch(`/api/documents/${document.id}?isTesting=true`)
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .set("Content-Type", "multipart/form-data")
        .field("documentType", "QUOTE")
        .field("opportunityId", 9999)
        .attach("file", filePath);
      expect(response.statusCode).toBe(404);
      expect(response.body.status).toBe("error");
    });
    it("should fail to update a document with non existing campaign id", async () => {
      const filePath = await createFile(uniquePrefix, "pdf");
      const document = await createDocument(
        userData.sales1.token,
        filePath,
        "PROPOSAL"
      );
      const response = await request(app)
        .patch(`/api/documents/${document.id}?isTesting=true`)
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .set("Content-Type", "multipart/form-data")
        .field("documentType", "QUOTE")
        .field("campaignId", 9999)
        .attach("file", filePath);
      expect(response.statusCode).toBe(404);
      expect(response.body.status).toBe("error");
    });
    it("should fail to update a document with non existing sale id", async () => {
      const filePath = await createFile(uniquePrefix, "pdf");
      const document = await createDocument(
        userData.sales1.token,
        filePath,
        "PROPOSAL"
      );
      const response = await request(app)
        .patch(`/api/documents/${document.id}?isTesting=true`)
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .set("Content-Type", "multipart/form-data")
        .field("documentType", "QUOTE")
        .field("saleId", 9999)
        .attach("file", filePath);
      expect(response.statusCode).toBe(404);
      expect(response.body.status).toBe("error");
    });
  });
  describe("DELETE /api/documents/:id", () => {
    it("should delete a document (admin and owner)", async () => {
      const filePath = await createFile(uniquePrefix, "pdf");
      const document = await createDocument(
        userData.sales1.token,
        filePath,
        "PROPOSAL"
      );
      const response = await request(app)
        .delete(`/api/documents/${document.id}?isTesting=true`)
        .set("Authorization", `Bearer ${userData.sales1.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
    });
    it("should delete a document by admin", async () => {
      const filePath = await createFile(uniquePrefix, "pdf");
      const document = await createDocument(
        userData.manager.token,
        filePath,
        "PROPOSAL"
      );
      const response = await request(app)
        .delete(`/api/documents/${document.id}?isTesting=true`)
        .set("Authorization", `Bearer ${userData.admin.token}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
    });
    it("should fail to delete a document by non admin", async () => {
      const filePath = await createFile(uniquePrefix, "pdf");
      const document = await createDocument(
        userData.sales2.token,
        filePath,
        "PROPOSAL"
      );
      const response = await request(app)
        .delete(`/api/documents/${document.id}?isTesting=true`)
        .set("Authorization", `Bearer ${userData.sales1.token}`);
      expect(response.statusCode).toBe(403);
      expect(response.body.status).toBe("error");
    });
    it("should fail to delete a document by non owner user", async () => {
      const filePath = await createFile(uniquePrefix, "pdf");
      const document = await createDocument(
        userData.sales1.token,
        filePath,
        "PROPOSAL"
      );
      const response = await request(app)
        .delete(`/api/documents/${document.id}?isTesting=true`)
        .set("Authorization", `Bearer ${userData.manager.token}`);
      expect(response.statusCode).toBe(403);
      expect(response.body.status).toBe("error");
    });
    it("should fail to delete a document with invalid id", async () => {
      const response = await request(app)
        .delete(`/api/documents/INVALID?isTesting=true`)
        .set("Authorization", `Bearer ${userData.sales1.token}`);
      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe("error");
    });
    it("should fail to delete a document by non existing id", async () => {
      const response = await request(app)
        .delete(`/api/documents/9999?isTesting=true`)
        .set("Authorization", `Bearer ${userData.sales1.token}`);
      expect(response.statusCode).toBe(404);
      expect(response.body.status).toBe("error");
    });
  });
});
