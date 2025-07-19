import leadRepository from "./../repositories/lead.repository.js";
import { AppError } from "../utils/AppError.js";
import customerRepository from "./../repositories/customer.repository.js";

const leadService = {
  createLead: async (userId, requestData) => {
    try {
      const { name, email, phone, status, customerId } = requestData;
      const existingCustomer = await customerRepository.findCustomerById(
        customerId
      );
      if (!existingCustomer) {
        throw new AppError("Customer not found", 404);
      }
      const lead = await leadRepository.createLead({
        name: name,
        email: email,
        phone: phone,
        status: status,
        customerId: customerId,
        createdByUserId: userId,
      });
      return lead;
    } catch (err) {
      if (err instanceof AppError) {
        throw err;
      }
      throw new AppError(err.message, 400);
    }
  },
  getAllLeads: async () => {
    try {
      const leads = await leadRepository.findAllLeads();
      return leads;
    } catch (err) {
      throw new AppError(err.message, 400);
    }
  },
  getLeadById: async (id) => {
    try {
      const lead = await leadRepository.findLeadById(id);
      if (!lead) {
        throw new AppError("Lead not found", 404);
      }
      return lead;
    } catch (err) {
      if (err instanceof AppError) {
        throw err;
      }
      throw new AppError(err.message, 400);
    }
  },
  updateLead: async (leadId, requestData) => {
    try {
      const existingCuscomer = await customerRepository.findCustomerById(
        requestData.customerId
      );
      if (!existingCuscomer) {
        throw new AppError("Customer not found", 404);
      }
      const updatedLead = await leadRepository.updateLead(leadId, requestData);
      return updatedLead;
    } catch (err) {
      if (err instanceof AppError) {
        throw err;
      }
      throw new AppError(err.message, 400);
    }
  },
  deleteLead: async (leadId) => {
    try {
      const existingLead = await leadRepository.findLeadById(leadId);
      if (!existingLead) {
        throw new AppError("Lead not found", 404);
      }
      return await leadRepository.deleteLead(leadId);
    } catch (err) {
      if (err instanceof AppError) {
        throw err;
      }
      throw new AppError(err.message, 400);
    }
  },
};

export default leadService;
