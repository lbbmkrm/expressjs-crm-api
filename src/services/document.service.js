import path from "path";
import fsPromises from "fs/promises";
import documentRepository from "../repositories/document.repository.js";
import customerRepository from "../repositories/customer.repository.js";
import contactRepository from "../repositories/contact.repository.js";
import leadRepository from "../repositories/lead.repository.js";
import opportunityRepository from "../repositories/opportunity.repository.js";
import campaignRepository from "../repositories/campaign.repository.js";
import saleRepository from "../repositories/sale.repository.js";
import { AppError } from "../utils/AppError.js";

const validateRelatedEntities = async (requestData) => {
  const { customerId, contactId, leadId, opportunityId, campaignId, saleId } =
    requestData;

  if (customerId) {
    const customer = await customerRepository.findById(parseInt(customerId));
    if (!customer) {
      throw new AppError("Customer not found", 404);
    }
  }
  if (contactId) {
    const contact = await contactRepository.findById(parseInt(contactId));
    if (!contact) {
      throw new AppError("Contact not found", 404);
    }
  }
  if (leadId) {
    const lead = await leadRepository.findById(parseInt(leadId));
    if (!lead) {
      throw new AppError("Lead not found", 404);
    }
  }
  if (opportunityId) {
    const opportunity = await opportunityRepository.findById(
      parseInt(opportunityId)
    );
    if (!opportunity) {
      throw new AppError("Opportunity not found", 404);
    }
  }
  if (campaignId) {
    const campaign = await campaignRepository.findById(parseInt(campaignId));
    if (!campaign) {
      throw new AppError("Campaign not found", 404);
    }
  }
  if (saleId) {
    const sale = await saleRepository.findById(parseInt(saleId));
    if (!sale) {
      throw new AppError("Sale not found", 404);
    }
  }
};

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
    try {
      await validateRelatedEntities(requestData);

      const {
        customerId,
        contactId,
        leadId,
        opportunityId,
        campaignId,
        saleId,
      } = requestData;

      const relativePath = path.relative(process.cwd(), file.path);
      const data = {
        name: `${file.filename}`,
        path: relativePath,
        size: file.size,
        fileType: file.mimetype,
        documentType: requestData.documentType,
        createdByUserId: userId,
        customerId: customerId ? parseInt(customerId) : null,
        contactId: contactId ? parseInt(contactId) : null,
        leadId: leadId ? parseInt(leadId) : null,
        opportunityId: opportunityId ? parseInt(opportunityId) : null,
        campaignId: campaignId ? parseInt(campaignId) : null,
        saleId: saleId ? parseInt(saleId) : null,
      };
      return documentRepository.create(data);
    } catch (error) {
      try {
        await fsPromises.unlink(file.path);
      } catch (err) {
        console.warn("Error deleting file", err.message);
        throw err;
      }
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message, 500);
    }
  },

  updateDocument: async (id, file, requestData) => {
    const document = await documentRepository.findById(id);
    if (!document) {
      throw new AppError("Document not found", 404);
    }

    await validateRelatedEntities(requestData);

    const {
      documentType,
      customerId,
      contactId,
      leadId,
      opportunityId,
      campaignId,
      saleId,
    } = requestData;

    const data = {
      documentType,
      customerId: customerId ? parseInt(customerId) : null,
      contactId: contactId ? parseInt(contactId) : null,
      leadId: leadId ? parseInt(leadId) : null,
      opportunityId: opportunityId ? parseInt(opportunityId) : null,
      campaignId: campaignId ? parseInt(campaignId) : null,
      saleId: saleId ? parseInt(saleId) : null,
    };

    if (file) {
      try {
        if (document.path) {
          const absolutePath = path.join(process.cwd(), document.path);
          await fsPromises.unlink(absolutePath);
        }
      } catch (err) {
        console.warn("Error deleting old file", err.message);
      }

      const relativePath = path.relative(process.cwd(), file.path);
      data.name = `${file.filename}`;
      data.path = relativePath;
      data.size = file.size;
      data.fileType = file.mimetype;
    }

    return documentRepository.update(id, data);
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
