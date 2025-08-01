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
  getAllActivities: async (relation) => {
    const sanitizedQuery = Object.fromEntries(
      Object.entries(relation).map(([key, value]) => {
        return key === "type" ? [key, value] : [key, Number(value)];
      })
    );
    return activityRepository.findByRelation(sanitizedQuery);
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
  getActivityByRelation: async (relation) => {
    await checkRelationExists(relation);
    return activityRepository.findByRelation(relation);
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
};
export default activityService;
