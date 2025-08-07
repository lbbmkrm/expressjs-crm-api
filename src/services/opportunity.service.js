import opportunityRepository from "../repositories/opportunity.repository.js";
import leadRepository from "../repositories/lead.repository.js";
import customerRepository from "../repositories/customer.repository.js";
import { AppError } from "../utils/AppError.js";
import saleRepository from "../repositories/sale.repository.js";
import activityRepository from "../repositories/activity.repository.js";
import noteRepository from "../repositories/note.repository.js";

const opportunityService = {
  createOpportunity: async (userId, requestData) => {
    if (requestData.customerId) {
      const existingCustomer = await customerRepository.findById(
        requestData.customerId
      );
      if (!existingCustomer) {
        throw new AppError("Customer not found", 404);
      }
    }
    if (requestData.leadId) {
      const existingLead = await leadRepository.findById(requestData.leadId);
      if (!existingLead) {
        throw new AppError("Lead not found", 404);
      }
      const existingLeadOpportunity = await opportunityRepository.findByLeadId(
        requestData.leadId
      );
      if (existingLeadOpportunity) {
        throw new AppError("Lead already has an opportunity", 400);
      }
    }

    requestData.createdByUserId = userId;
    return opportunityRepository.create(requestData);
  },
  getAllOpportunities: async (stage) => {
    return opportunityRepository.all(stage);
  },
  getOpportunityById: async (id) => {
    const opportunity = await opportunityRepository.findById(id);
    if (!opportunity) {
      throw new AppError("Opportunity not found", 404);
    }
    return opportunity;
  },
  updateOpportunity: async (opportunityId, requestData) => {
    const opportunity = await opportunityRepository.findById(opportunityId);
    if (!opportunity) {
      throw new AppError("Opportunity not found", 404);
    }
    if (requestData.customerId) {
      const existingCustomer = await customerRepository.findById(
        requestData.customerId
      );
      if (!existingCustomer) {
        throw new AppError("Customer not found", 404);
      }
    }
    if (requestData.leadId) {
      const existingLead = await leadRepository.findById(requestData.leadId);
      if (!existingLead) {
        throw new AppError("Lead not found", 404);
      }
      const existingLeadOpportunity = await opportunityRepository.findByLeadId(
        requestData.leadId
      );
      if (existingLeadOpportunity) {
        throw new AppError("Lead already has an opportunity", 400);
      }
    }
    const updatedOpportunity = await opportunityRepository.update(
      opportunityId,
      requestData
    );
    return updatedOpportunity;
  },
  deleteOpportunity: async (opportunityId) => {
    const opportunity = await opportunityRepository.findById(opportunityId);
    if (!opportunity) {
      throw new AppError("Opportunity not found", 404);
    }
    return opportunityRepository.delete(opportunityId);
  },
  getOpportunitySales: async (opportunityId) => {
    const opportunity = await opportunityRepository.findById(opportunityId);
    if (!opportunity) {
      throw new AppError("Opportunity not found", 404);
    }
    return saleRepository.findByOpportunityId(opportunityId);
  },
  getOpportunityActivities: async (opportunityId) => {
    const opportunity = await opportunityRepository.findById(opportunityId);
    if (!opportunity) {
      throw new AppError("Opportunity not found", 404);
    }
    return activityRepository.findByOpportunityId(opportunityId);
  },
  getOpportunityNotes: async (opportunityId) => {
    const opportunity = await opportunityRepository.findById(opportunityId);
    if (!opportunity) {
      throw new AppError("Opportunity not found", 404);
    }
    return noteRepository.findByOpportunityId(opportunityId);
  },
};

export default opportunityService;
