import customerRepository from "../repositories/customer.repository.js";
import { AppError } from "../utils/AppError.js";

const customerService = {
  createCustomer: async (userId, data) => {
    data.createdByUserId = userId;
    return customerRepository.createCustomer(data);
  },
  getAllCustomers: async () => {
    return customerRepository.findAllCustomers();
  },
  getCustomer: async (id) => {
    const customer = await customerRepository.findCustomerById(id);
    if (!customer) {
      throw new AppError("Customer not found", 404);
    }
    return customer;
  },
  updateCustomer: async (id, data) => {
    const user = await customerRepository.findCustomerById(id);
    if (!user) {
      throw new AppError("Customer not found", 404);
    }
    return customerRepository.updateCustomer(id, data);
  },
  deleteCustomer: async (id) => {
    const costumer = await customerRepository.findCustomerById(id);
    if (!costumer) {
      throw new AppError("Customer not found", 404);
    }
    return customerRepository.deleteCustomer(id);
  },
};

export default customerService;
