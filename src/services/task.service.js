import taskRepository from "../repositories/task.repository.js";
import { AppError } from "../utils/AppError.js";
import customerRepository from "../repositories/customer.repository.js";
import leadRepository from "../repositories/lead.repository.js";
import opportunityRepository from "../repositories/opportunity.repository.js";
import userRepository from "../repositories/user.repository.js";

async function checkAssignedUserExists(assignedToUserId) {
  const user = await userRepository.findById(assignedToUserId);
  if (!user) {
    throw new AppError("Assigned user not found", 404);
  }
}
async function checkCustomerExists(customerId) {
  const customer = await customerRepository.findById(customerId);
  if (!customer) {
    throw new AppError("Customer not found", 404);
  }
}
async function checkLeadExists(leadId) {
  const lead = await leadRepository.findById(leadId);
  if (!lead) {
    throw new AppError("Lead not found", 404);
  }
}
async function checkOpportunityExists(opportunityId) {
  const opportunity = await opportunityRepository.findById(opportunityId);
  if (!opportunity) {
    throw new AppError("Opportunity not found", 404);
  }
}
const taskService = {
  createTask: async (userId, requestData) => {
    await checkAssignedUserExists(requestData.assignedToUserId);
    if (requestData.customerId) {
      await checkCustomerExists(requestData.customerId);
    }
    if (requestData.leadId) {
      await checkLeadExists(requestData.leadId);
    }
    if (requestData.opportunityId) {
      await checkOpportunityExists(requestData.opportunityId);
    }
    requestData.createdByUserId = userId;
    return taskRepository.create(requestData);
  },
  getAllTasks: async (query) => {
    if (query.assignedUserId) {
      const assignedUserId = parseInt(query.assignedUserId);
      const user = await userRepository.findById(assignedUserId);
      if (!user) {
        throw new AppError("User not found", 404);
      }
      query.assignedUserId = assignedUserId;
    }
    return taskRepository.all(query);
  },
  getTaskById: async (id) => {
    const task = await taskRepository.findById(id);
    if (!task) {
      throw new AppError("Task not found", 404);
    }
    return task;
  },
  getUserTasks: async (userId) => {
    return taskRepository.findByUserId(userId);
  },
  updateTask: async (taskId, requestData) => {
    const task = await taskRepository.findById(taskId);
    if (!task) {
      throw new AppError("Task not found", 404);
    }
    if (requestData.assignedToUserId) {
      await checkAssignedUserExists(requestData.assignedToUserId);
    }
    if (requestData.customerId) {
      await checkCustomerExists(requestData.customerId);
    }
    if (requestData.leadId) {
      await checkLeadExists(requestData.leadId);
    }
    if (requestData.opportunityId) {
      await checkOpportunityExists(requestData.opportunityId);
    }
    if (requestData.status === "COMPLETED") {
      requestData.completedAt = new Date();
    }
    const updatedTask = await taskRepository.update(taskId, requestData);
    return updatedTask;
  },
  deleteTask: async (taskId) => {
    const task = await taskRepository.findById(taskId);
    if (!task) {
      throw new AppError("Task not found", 404);
    }
    return taskRepository.delete(taskId);
  },
};
export default taskService;
