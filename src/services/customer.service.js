import customerRepository from "../repositories/customer.repository.js";
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
};

export default customerService;
