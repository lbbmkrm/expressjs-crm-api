import { AppError } from "../utils/AppError.js";
import contactRepository from "./../repositories/contact.repository.js";
import customerRepository from "./../repositories/customer.repository.js";

const contactService = {
  createContact: async (userId, data) => {
    const existingContact = await contactRepository.findyByEmail(data.email);
    if (existingContact) {
      throw new AppError("Contact with this email already exists", 400);
    }

    const customer = await customerRepository.findById(data.customerId);
    if (!customer) {
      throw new AppError("Customer not found", 404);
    }

    data.createdByUserId = userId;
    return contactRepository.create(data);
  },

  getAllContacts: async () => {
    return contactRepository.findAll();
  },

  getContact: async (id) => {
    const contact = await contactRepository.findById(id);
    if (!contact) {
      throw new AppError("Contact not found", 404);
    }
    return contact;
  },

  updateContact: async (id, data) => {
    const contact = await contactRepository.findById(id);
    if (!contact) {
      throw new AppError("Contact not found", 404);
    }
    return contactRepository.update(id, data);
  },

  deleteContact: async (id) => {
    const contact = await contactRepository.findById(id);
    if (!contact) {
      throw new AppError("Contact not found", 404);
    }
    return contactRepository.delete(id);
  },
};

export default contactService;
