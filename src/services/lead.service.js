import leadRepository from "./../repositories/lead.repository.js";
import { AppError } from "../utils/AppError.js";
import customerRepository from "./../repositories/customer.repository.js";
import prisma from "./../repositories/prismaClient.js";
import opportunityRepository from "../repositories/opportunity.repository.js";
import activityRepository from "../repositories/activity.repository.js";
import noteRepository from "../repositories/note.repository.js";

const leadService = {
  createLead: async (userId, requestData) => {
    const { name, email, phone, status, customerId } = requestData;

    if (customerId) {
      const existingCustomer = await customerRepository.findById(customerId);
      if (!existingCustomer) {
        throw new AppError("Customer not found", 404);
      }
    }

    const lead = await leadRepository.create({
      name,
      email,
      phone,
      status,
      customerId,
      createdByUserId: userId,
    });

    return lead;
  },

  getAllLeads: async (status) => {
    return leadRepository.all(status);
  },
  getLeadById: async (id) => {
    const lead = await leadRepository.findById(id);
    if (!lead) {
      throw new AppError("Lead not found", 404);
    }
    return lead;
  },

  updateLead: async (leadId, requestData) => {
    if (requestData.customerId) {
      const existingCustomer = await customerRepository.findById(
        requestData.customerId
      );
      if (!existingCustomer) {
        throw new AppError("Customer not found", 404);
      }
    }
    const updatedLead = await leadRepository.update(leadId, requestData);
    return updatedLead;
  },

  deleteLead: async (leadId) => {
    const existingLead = await leadRepository.findById(leadId);
    if (!existingLead) {
      throw new AppError("Lead not found", 404);
    }

    return leadRepository.delete(leadId);
  },
  convertLead: async (leadId, userId) => {
    return prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT  id FROM leads WHERE id = ${leadId} AND deleted_at = NULL`;
      const lead = await tx.lead.findUnique({
        where: {
          id: leadId,
          deletedAt: null,
        },
      });
      if (!lead) {
        throw new AppError("Lead not found", 404);
      }
      if (lead.status === "CONVERTED") {
        throw new AppError("Lead already converted", 400);
      }
      const customer = await tx.customer.create({
        data: {
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          createdByUserId: userId,
        },
      });

      const contact = await tx.contact.create({
        data: {
          firstName: lead.name,
          email: lead.email,
          phone: lead.phone,
          customerId: customer.id,
          createdByUserId: userId,
        },
      });

      const opportunity = await tx.opportunity.create({
        data: {
          name: `Opportunity from ${lead.name}`,
          amount: 0,
          stage: "QUALIFICATION",
          customerId: customer.id,
          leadId: lead.id,
          createdByUserId: userId,
        },
      });

      await tx.lead.update({
        where: {
          id: leadId,
          deletedAt: null,
        },
        data: {
          status: "CONVERTED",
          customerId: customer.id,
        },
      });
      return { customer, contact, opportunity };
    });
  },
  getOpportunitiesByLeadId: async (leadId) => {
    const lead = await leadRepository.findById(leadId);
    if (!lead) {
      throw new AppError("Lead not found", 404);
    }
    return opportunityRepository.findAllByLeadId(leadId);
  },
  getActivitiesByLeadId: async (leadId) => {
    const lead = await leadRepository.findById(leadId);
    if (!lead) {
      throw new AppError("Lead not found", 404);
    }
    return activityRepository.findByLeadId(leadId);
  },
  getNotesByLeadId: async (leadId) => {
    const lead = await leadRepository.findById(leadId);
    if (!lead) {
      throw new AppError("Lead not found", 404);
    }
    return noteRepository.findByLeadId(leadId);
  },
};

export default leadService;
