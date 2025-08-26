import { AppError } from "../utils/AppError.js";
import ticketRepository from "../repositories/ticket.repository.js";
import userRepository from "../repositories/user.repository.js";
import customerRepository from "../repositories/customer.repository.js";

const ticketService = {
  getAllTickets: async (status) => {
    return await ticketRepository.all(status);
  },
  getTicketById: async (id) => {
    const ticket = await ticketRepository.findById(id);
    if (!ticket) {
      throw new AppError("Ticket not found", 404);
    }
    return ticket;
  },
  getTicketByCreatorId: async (creatorId) => {
    const creator = await userRepository.findById(creatorId);
    if (!creator) {
      throw new AppError("Creator not found", 404);
    }
    return await ticketRepository.findByCreatorId(creatorId);
  },
  getTicketByAssignedId: async (assignedUserId) => {
    const assignedUser = await userRepository.findById(assignedUserId);
    if (!assignedUser) {
      throw new AppError("Assigned user not found", 404);
    }
    return await ticketRepository.findByAssignedId(assignedUserId);
  },
  createTicket: async (creatorId, requestData) => {
    const customer = await customerRepository.findById(requestData.customerId);
    if (!customer) {
      throw new AppError("Customer not found", 404);
    }
    const assignedUser = await userRepository.findById(
      requestData.assignedToUserId
    );
    if (!assignedUser) {
      throw new AppError("Assigned user not found", 404);
    }
    const data = {
      ...requestData,
      createdByUserId: creatorId,
    };
    return await ticketRepository.create(data);
  },
  updateTicket: async (id, requestData) => {
    const ticket = await ticketService.getTicketById(id);
    if (!ticket) {
      throw new AppError("Ticket not found", 404);
    }
    if (requestData.assignedToUserId) {
      const assignedUser = await userRepository.findById(
        requestData.assignedToUserId
      );
      if (!assignedUser) {
        throw new AppError("Assigned user not found", 404);
      }
    }
    return await ticketRepository.update(id, requestData);
  },
  solveTicket: async () => {
    return await ticketRepository.update(id, {
      status: "SOLVED",
      solvedAt: new Date(),
    });
  },
  deleteTicket: async (id) => {
    const ticket = await ticketService.getTicketById(id);
    if (!ticket) {
      throw new AppError("Ticket not found", 404);
    }
    return await ticketRepository.softDelete(id);
  },
  getTicketDocuments: async (ticketId) => {
    const ticket = await ticketRepository.findById(ticketId);
    if (!ticket) {
      throw new AppError("Ticket not found", 404);
    }
    return await documentRepository.findByTicketId(ticketId);
  },
  addDocumentToTicket: async (ticketId, documentId) => {
    const ticket = await ticketRepository.findById(ticketId);
    if (!ticket) {
      throw new AppError("Ticket not found", 404);
    }
    const document = await documentRepository.findById(documentId);
    if (!document) {
      throw new AppError("Document not found", 404);
    }
    return await documentRepository.associateDocumentWithTicket(documentId, ticketId);
  },
  removeDocumentFromTicket: async (ticketId, documentId) => {
    const ticket = await ticketRepository.findById(ticketId);
    if (!ticket) {
      throw new AppError("Ticket not found", 404);
    }
    const document = await documentRepository.findById(documentId);
    if (!document) {
      throw new AppError("Document not found", 404);
    }
    if (document.ticketId !== ticketId) {
      throw new AppError("Document is not associated with this ticket", 400);
    }
    return await documentRepository.associateDocumentWithTicket(documentId, null);
  },
};

export default ticketService;
