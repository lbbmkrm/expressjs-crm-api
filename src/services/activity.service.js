import { AppError } from "../utils/AppError.js";
import activityRepository from "../repositories/activity.repository.js";
import customerRepository from "../repositories/customer.repository.js";
import contactRepository from "../repositories/contact.repository.js";
import leadRepository from "../repositories/lead.repository.js";
import opportunityRepository from "../repositories/opportunity.repository.js";

const checkRelationExists = async (relation) => {
  if (relation.customerId) {
    const customer = await customerRepository.findById(relation.customerId);
    if (!customer) {
      throw new AppError("Customer not found", 404);
    }
  }
  if (relation.contactId) {
    const contact = await contactRepository.findById(relation.contactId);
    if (!contact) {
      throw new AppError("Contact not found", 404);
    }
  }
  if (relation.leadId) {
    const lead = await leadRepository.findById(relation.leadId);
    if (!lead) {
      throw new AppError("Lead not found", 404);
    }
  }
  if (relation.opportunityId) {
    const opportunity = await opportunityRepository.findById(
      relation.opportunityId
    );
    if (!opportunity) {
      throw new AppError("Opportunity not found", 404);
    }
  }
  return true;
};
const activityService = {
  getAllActivities: async (type) => {
    return activityRepository.all(type);
  },
  getByUserId: async (userId) => {
    return activityRepository.findByUserId(userId);
  },
  getActivity: async (id) => {
    const activity = await activityRepository.findById(id);
    if (!activity) {
      throw new AppError("Activity not found", 404);
    }
    return activity;
  },
  getActivityById: async (activityId) => {
    const activity = await activityRepository.findById(activityId);
    if (!activity) {
      throw new AppError("Activity not found", 404);
    }
    return activity;
  },
  createActivity: async (userId, requestData) => {
    await checkRelationExists(requestData);
    requestData.createdByUserId = userId;
    return activityRepository.create(requestData);
  },
  updateActivity: async (id, requestData) => {
    const activity = await activityRepository.findById(id);
    if (!activity) {
      throw new AppError("Activity not found", 404);
    }
    await checkRelationExists(requestData);
    return activityRepository.update(id, requestData);
  },
  deleteActivity: async (id) => {
    const activity = await activityRepository.findById(id);
    if (!activity) {
      throw new AppError("Activity not found", 404);
    }
    return activityRepository.delete(id);
  },
  getActivityDocuments: async (activityId) => {
    const activity = await activityRepository.findById(activityId);
    if (!activity) {
      throw new AppError("Activity not found", 404);
    }
    return await documentRepository.findByActivityId(activityId);
  },
  addDocumentToActivity: async (activityId, documentId) => {
    const activity = await activityRepository.findById(activityId);
    if (!activity) {
      throw new AppError("Activity not found", 404);
    }
    const document = await documentRepository.findById(documentId);
    if (!document) {
      throw new AppError("Document not found", 404);
    }
    return await documentRepository.associateDocumentWithActivity(documentId, activityId);
  },
  removeDocumentFromActivity: async (activityId, documentId) => {
    const activity = await activityRepository.findById(activityId);
    if (!activity) {
      throw new AppError("Activity not found", 404);
    }
    const document = await documentRepository.findById(documentId);
    if (!document) {
      throw new AppError("Document not found", 404);
    }
    if (document.activityId !== activityId) {
      throw new AppError("Document is not associated with this activity", 400);
    }
    return await documentRepository.associateDocumentWithActivity(documentId, null);
  },
};
export default activityService;
