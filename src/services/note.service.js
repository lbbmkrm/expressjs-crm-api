import noteRepository from "../repositories/note.repository.js";
import { AppError } from "../utils/AppError.js";
import customerRepository from "../repositories/customer.repository.js";
import contactRepository from "../repositories/contact.repository.js";
import leadRepository from "../repositories/lead.repository.js";
import opportunityRepository from "../repositories/opportunity.repository.js";

const checkRequestRelation = async (requestData) => {
  const relatedEntityIds = [
    requestData.customerId,
    requestData.contactId,
    requestData.leadId,
    requestData.opportunityId,
  ].filter(Boolean);
  if (relatedEntityIds.length === 0) {
    throw new AppError("At least one related entity ID must be provided", 400);
  }
  if (relatedEntityIds.length > 1) {
    throw new AppError("Only one related entity ID can be provided", 400);
  }
  return true;
};
const checkRelationExists = async (requestData) => {
  if (requestData.customerId) {
    const customer = await customerRepository.findById(requestData.customerId);
    if (!customer) {
      throw new AppError("Customer not found", 404);
    }
    return true;
  }
  if (requestData.contactId) {
    const contact = await contactRepository.findById(requestData.contactId);
    if (!contact) {
      throw new AppError("Contact not found", 404);
    }
    return true;
  }
  if (requestData.leadId) {
    const lead = await leadRepository.findById(requestData.leadId);
    if (!lead) {
      throw new AppError("Lead not found", 404);
    }
    return true;
  }
  if (requestData.opportunityId) {
    const opportunity = await opportunityRepository.findById(
      requestData.opportunityId
    );
    if (!opportunity) {
      throw new AppError("Opportunity not found", 404);
    }
    return true;
  }
  return false;
};
const noteService = {
  createNote: async (userId, requestData) => {
    await checkRequestRelation(requestData);
    await checkRelationExists(requestData);
    requestData.createdByUserId = userId;
    return noteRepository.create(requestData);
  },
  getAllNotes: async () => {
    return noteRepository.all();
  },
  getNotesByUserId: async (userId) => {
    return noteRepository.findByUserId(userId);
  },
  getNote: async (id) => {
    const note = await noteRepository.findById(id);
    if (!note) {
      throw new AppError("Note not found", 404);
    }
    return note;
  },
  updateNote: async (id, requestData) => {
    const note = await noteRepository.findById(id);
    if (!note) {
      throw new AppError("Note not found", 404);
    }
    return noteRepository.update(id, requestData);
  },
  deleteNote: async (id) => {
    const note = await noteRepository.findById(id);
    if (!note) {
      throw new AppError("Note not found", 404);
    }
    return noteRepository.delete(id);
  },
};

export default noteService;
