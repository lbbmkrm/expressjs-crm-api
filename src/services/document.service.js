import documentRepository from "../repositories/document.repository.js";
import customerRepository from "../repositories/customer.repository.js";
import contactRepository from "../repositories/contact.repository.js";
import leadRepository from "../repositories/lead.repository.js";
import opportunityRepository from "../repositories/opportunity.repository.js";
import saleRepository from "../repositories/sale.repository.js";
import { AppError } from "../utils/AppError.js";
import { parse } from "path";

const documentService = {
  getAllDocuments: async (documentType) => {
    return documentRepository.all(documentType);
  },
  getDocumentById: async (id) => {
    const document = await documentRepository.findById(id);
    if (!document) {
      throw new AppError("Document not found", 404);
    }
    return document;
  },
  createDocument: async (userId, file, requestData) => {
    if (!file) {
      throw new AppError("File is required", 400);
    }
    if (requestData.customerId) {
      const customer = await customerRepository.findById(
        requestData.customerId
      );
      if (!customer) {
        throw new AppError("Customer not found", 404);
      }
    }
    if (requestData.contactId) {
      const contact = await contactRepository.findById(
        parseInt(requestData.contactId)
      );
      if (!contact) {
        throw new AppError("Contact not found", 404);
      }
    }
    if (requestData.leadId) {
      const lead = await leadRepository.findById(parseInt(requestData.leadId));
      if (!lead) {
        throw new AppError("Lead not found", 404);
      }
    }
    if (requestData.opportunityId) {
      const opportunity = await opportunityRepository.findById(
        parseInt(requestData.opportunityId)
      );
      if (!opportunity) {
        throw new AppError("Opportunity not found", 404);
      }
    }
    if (requestData.saleId) {
      const sale = await saleRepository.findById(parseInt(requestData.saleId));
      if (!sale) {
        throw new AppError("Sale not found", 404);
      }
    }
    const data = {
      name: file.originalname,
      path: file.path,
      size: file.size,
      fileType: file.mimetype,
      documentType: requestData.documentType,
      createdByUserId: userId,
      ...requestData,
    };
    return documentRepository.create(data);
  },
  updateDocument: async (id, requestData) => {
    const document = await documentRepository.findById(id);
    if (!document) {
      throw new AppError("Document not found", 404);
    }
    return documentRepository.update(id, requestData);
  },
  deleteDocument: async (id) => {
    const document = await documentRepository.findById(id);
    if (!document) {
      throw new AppError("Document not found", 404);
    }
    return documentRepository.softDelete(id);
  },
};

export default documentService;
