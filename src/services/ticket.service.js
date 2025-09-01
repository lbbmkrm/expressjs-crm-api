import { AppError } from "../utils/AppError.js";
import ticketRepository from "../repositories/ticket.repository.js";
import userRepository from "../repositories/user.repository.js";
import customerRepository from "../repositories/customer.repository.js";
import documentRepository from "../repositories/document.repository.js";

const ticketService = {
  getAllTickets: async (query) => {
    if (query.creator) {
      const creatorId = parseInt(query.creator);
      const creator = await userRepository.findById(creatorId);
      if (!creator) {
        throw new AppError("Creator not found", 404);
      }
      query.creator = creatorId;
    }
    return await ticketRepository.all(query);
  },
  getTicketById: async (id) => {
    const ticket = await ticketRepository.findById(id);
    if (!ticket) {
      throw new AppError("Ticket not found", 404);
    }
    return ticket;
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
};

export default ticketService;
