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
  createSale,
} from "./testHelpers.js";

describe("Document Endpoints", () => {
  let uniquePrefix;
  let userData;
  const createFile = async (extension) => {
    try {
      const targetDir = path.join(process.cwd(), "uploads", "documents");
      try {
        await fsPromises.access(targetDir);
      } catch (err) {
        await fsPromises.mkdir(targetDir);
      }
      const filePath = path.join(
        targetDir,
        `${uniquePrefix}_test.${extension}`
      );
      await fsPromises.writeFile(filePath, "test");
      return filePath;
    } catch (error) {
      throw error;
    }
  };

  beforeAll(async () => {
    await cleanupModels("document_", ["document"]);
    await cleanupUsers("doc_");
    uniquePrefix = `doc_${Date.now()}`;
    userData = await setupUsers(uniquePrefix);
  });

  beforeEach(async () => {
    uniquePrefix = `document_${Date.now()}`;
  });

  afterAll(async () => {
    const testUploadDir = path.join(process.cwd(), "uploads", "documents");
    try {
      const files = await fsPromises.readdir(testUploadDir);
      for (const file of files) {
        const filePath = path.join(testUploadDir, file);
        await fsPromises.unlink(filePath);
      }
      await fsPromises.rmdir(testUploadDir);
    } catch (err) {
      console.warn("Error cleaning up test files", err.message);
    }
  });

  describe("POST /api/documents", () => {
    it("should create a document", async () => {
      const filePath = await createFile("pdf");
      const response = await request(app)
        .post("/api/documents")
        .set("Authorization", `Bearer ${userData.admin.token}`)
        .set("Content-Type", "multipart/form-data")
        .field("documentType", "PROPOSAL")
        .attach("file", filePath);
      expect(response.status).toBe(201);
    });
  });
});
