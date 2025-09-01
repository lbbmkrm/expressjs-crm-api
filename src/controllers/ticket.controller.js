import ticketService from "../services/ticket.service.js";

const ticketController = {
  index: async (req, res, next) => {
    try {
      const tickets = await ticketService.getAllTickets(req.query);
      const message =
        tickets.length === 0
          ? "No tickets found"
          : "Tickets retrieved successfully";
      res.status(200).json({
        status: "success",
        message: message,
        data: tickets,
      });
    } catch (err) {
      next(err);
    }
  },
  show: async (req, res, next) => {
    try {
      const ticket = await ticketService.getTicketById(parseInt(req.params.id));
      res.status(200).json({
        status: "success",
        message: "Ticket retrieved successfully",
        data: ticket,
      });
    } catch (err) {
      next(err);
    }
  },
  showByAssignedUser: async (req, res, next) => {
    try {
      const tickets = await ticketService.getTicketByAssignedId(
        parseInt(req.user.id)
      );
      const message =
        tickets.length === 0
          ? "No tickets found"
          : "Tickets retrieved successfully";
      res.status(200).json({
        status: "success",
        message: message,
        data: tickets,
      });
    } catch (err) {
      next(err);
    }
  },
  create: async (req, res, next) => {
    try {
      const ticket = await ticketService.createTicket(req.user.id, req.body);
      res.status(201).json({
        status: "success",
        message: "Ticket created successfully",
        data: ticket,
      });
    } catch (err) {
      next(err);
    }
  },
  update: async (req, res, next) => {
    try {
      const ticket = await ticketService.updateTicket(
        parseInt(req.params.id),
        req.body
      );
      res.status(200).json({
        status: "success",
        message: "Ticket updated successfully",
        data: ticket,
      });
    } catch (err) {
      next(err);
    }
  },
  solve: async (req, res, next) => {
    try {
      const ticket = await ticketService.solveTicket(parseInt(req.params.id));
      res.status(200).json({
        status: "success",
        message: "Ticket solved successfully",
        data: ticket,
      });
    } catch (err) {
      next(err);
    }
  },
  destroy: async (req, res, next) => {
    try {
      await ticketService.deleteTicket(parseInt(req.params.id));
      res.status(200).json({
        status: "success",
        message: "Ticket deleted successfully",
      });
    } catch (err) {
      next(err);
    }
  },
};
export default ticketController;
