import leadRepository from "./../repositories/lead.repository.js";
import { AppError } from "../utils/AppError.js";
import customerRepository from "./../repositories/customer.repository.js";

const leadService = {
  createLead: async (userId, requestData) => {
    const { name, email, phone, status, customerId } = requestData;

    const existingCustomer = await customerRepository.findCustomerById(
      customerId
    );
    if (!existingCustomer) {
      throw new AppError("Customer not found", 404);
    }

    const lead = await leadRepository.createLead({
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
    return leadRepository.findAllLeads();
  },

  getLeadById: async (id) => {
    const lead = await leadRepository.findLeadById(id);
    if (!lead) {
      throw new AppError("Lead not found", 404);
    }
    return lead;
  },

  updateLead: async (leadId, requestData) => {
    const existingCustomer = await customerRepository.findById(
      requestData.customerId
    );
    if (!existingCustomer) {
      throw new AppError("Customer not found", 404);
    }

    const updatedLead = await leadRepository.updateLead(leadId, requestData);
    return updatedLead;
  },

  deleteLead: async (leadId) => {
    const existingLead = await leadRepository.findLeadById(leadId);
    if (!existingLead) {
      throw new AppError("Lead not found", 404);
    }

    return leadRepository.deleteLead(leadId);
  },
};

export default leadService;
