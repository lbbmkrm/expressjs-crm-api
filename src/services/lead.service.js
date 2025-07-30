import leadRepository from "./../repositories/lead.repository.js";
import { AppError } from "../utils/AppError.js";
import customerRepository from "./../repositories/customer.repository.js";

const leadService = {
  createLead: async (userId, requestData) => {
    const { name, email, phone, status, customerId } = requestData;

    if (customerId) {
      const existingCustomer = await customerRepository.findById(customerId);
      if (!existingCustomer) {
        throw new AppError("Customer not found", 404);
      }
    }

    const lead = await leadRepository.create({
      name,
      email,
      phone,
      status,
      customerId,
      createdByUserId: userId,
    });

    return lead;
  },

  getAllLeads: async () => {
    return leadRepository.all();
  },
  getLeadsByStatus: async (status) => {
    return leadRepository.findByStatus(status);
  },

  getLeadById: async (id) => {
    const lead = await leadRepository.findById(id);
    if (!lead) {
      throw new AppError("Lead not found", 404);
    }
    return lead;
  },

  updateLead: async (leadId, requestData) => {
    if (requestData.customerId) {
      const existingCustomer = await customerRepository.findById(
        requestData.customerId
      );
      if (!existingCustomer) {
        throw new AppError("Customer not found", 404);
      }
    }
    const updatedLead = await leadRepository.update(leadId, requestData);
    return updatedLead;
  },

  deleteLead: async (leadId) => {
    const existingLead = await leadRepository.findById(leadId);
    if (!existingLead) {
      throw new AppError("Lead not found", 404);
    }

    return leadRepository.delete(leadId);
  },
};

export default leadService;
