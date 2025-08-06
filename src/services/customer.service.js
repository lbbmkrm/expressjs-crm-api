import activityRepository from "../repositories/activity.repository.js";
import contactRepository from "../repositories/contact.repository.js";
import customerRepository from "../repositories/customer.repository.js";
import leadRepository from "../repositories/lead.repository.js";
import noteRepository from "../repositories/note.repository.js";
import opportunityRepository from "../repositories/opportunity.repository.js";
import saleRepository from "../repositories/sale.repository.js";
import { AppError } from "../utils/AppError.js";

const customerService = {
  createCustomer: async (userId, data) => {
    const existingCustomer = await customerRepository.findByEmail(data.email);
    if (existingCustomer) {
      throw new AppError("Customer with this email already exists", 400);
    }
    data.createdByUserId = userId;
    return customerRepository.create(data);
  },

  getAllCustomers: async () => {
    return customerRepository.all();
  },

  getCustomer: async (id) => {
    const customer = await customerRepository.findById(id);
    if (!customer) {
      throw new AppError("Customer not found", 404);
    }
    return customer;
  },

  updateCustomer: async (id, data) => {
    const customer = await customerRepository.findById(id);
    if (!customer) {
      throw new AppError("Customer not found", 404);
    }
    return customerRepository.update(id, data);
  },

  deleteCustomer: async (id) => {
    const customer = await customerRepository.findById(id);
    if (!customer) {
      throw new AppError("Customer not found", 404);
    }
    return customerRepository.delete(id);
  },
  getCustomerContacts: async (customerId) => {
    const customer = await customerRepository.findById(customerId);
    if (!customer) {
      throw new AppError("Customer not found", 404);
    }
    return contactRepository.findByCustomerId(customerId);
  },
  getCustomerLeads: async (customerId) => {
    const customer = await customerRepository.findById(customerId);
    if (!customer) {
      throw new AppError("Customer not found", 404);
    }
    return leadRepository.findByCustomerId(customerId);
  },
  getCustomerOpportunities: async (customerId) => {
    const opportunities = await opportunityRepository.findByCustomerId(
      customerId
    );
    if (!opportunities) {
      throw new AppError("Customer not found", 404);
    }
    return opportunities;
  },
  getCustomerSales: async (customerId) => {
    const customer = await customerRepository.findById(customerId);
    if (!customer) {
      throw new AppError("Customer not found", 404);
    }
    return saleRepository.findByCustomerId(customerId);
  },
  getCustomerActivities: async (customerId) => {
    const customer = await customerRepository.findById(customerId);
    if (!customer) {
      throw new AppError("Customer not found", 404);
    }
    return activityRepository.findByCustomerId(customerId);
  },
  getCustomerNotes: async (customerId) => {
    const customer = await customerRepository.findById(customerId);
    if (!customer) {
      throw new AppError("Customer not found", 404);
    }
    return noteRepository.findByCustomerId(customerId);
  },
};

export default customerService;
