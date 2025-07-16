import { AppError } from "../utils/AppError.js";
import contactRepository from "./../repositories/contact.repository.js";
import customerRepository from "./../repositories/customer.repository.js";
const contactService = {
  createContact: async (userId, data) => {
    const existingContact = await contactRepository.findContactByEmail(
      data.email
    );
    if (existingContact) {
      throw new AppError("Contact with this email already exists", 400);
    }
    const customer = await customerRepository.findCustomerById(data.customerId);
    if (!customer) {
      throw new AppError("Customer not found", 404);
    }
    data.createdByUserId = userId;
    return contactRepository.createContact(data);
  },
  updateContact: async (id, data) => {
    const contact = await contactRepository.findContactById(id);
    if (!contact) {
      throw new AppError("Contact not found", 404);
    }
    const updatedContact = await contactRepository.updateContact(id, data);

    return updatedContact;
  },
  deleteContact: async (id) => {
    const contact = await contactRepository.findContactById(id);
    if (!contact) {
      throw new AppError("Contact not found", 404);
    }
    return await contactRepository.deleteContact(id);
  },
  getContact: async (id) => {
    const contact = await contactRepository.findContactById(id);
    if (!contact) {
      throw new AppError("Contact not found", 404);
    }
    return contact;
  },
  getAllContacts: async () => {
    return contactRepository.findAllContacts();
  },
};

export default contactService;
