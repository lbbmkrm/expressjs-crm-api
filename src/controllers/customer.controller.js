import customerService from "../services/customer.service.js";

const customerController = {
  index: async (req, res, next) => {
    try {
      const customers = await customerService.getAllCustomers();
      const message =
        customers.length === 0
          ? "No customers found"
          : "Customers retrieved successfully";
      res.status(200).json({
        status: "success",
        message: message,
        data: customers,
      });
    } catch (err) {
      next(err);
    }
  },
  show: async (req, res, next) => {
    try {
      const customerId = parseInt(req.params.id);
      const customer = await customerService.getCustomer(customerId);
      res.status(200).json({
        status: "success",
        message: "Customer retrieved successfully",
        data: customer,
      });
    } catch (err) {
      next(err);
    }
  },
  create: async (req, res, next) => {
    try {
      const customer = await customerService.createCustomer(
        req.user.id,
        req.body
      );
      res.status(201).json({
        status: "success",
        message: "Customer created successfully",
        data: customer,
      });
    } catch (err) {
      next(err);
    }
  },
  update: async (req, res, next) => {
    try {
      const customerId = parseInt(req.params.id);
      const customer = await customerService.updateCustomer(
        customerId,
        req.body
      );
      res.status(200).json({
        status: "success",
        message: "Customer updated successfully",
        data: customer,
      });
    } catch (err) {
      next(err);
    }
  },
  destroy: async (req, res, next) => {
    try {
      const customerId = parseInt(req.params.id);
      await customerService.deleteCustomer(customerId);
      res.status(200).json({
        status: "success",
        message: "Customer deleted successfully",
      });
    } catch (err) {
      next(err);
    }
  },
  showContacts: async (req, res, next) => {
    try {
      const contacts = await customerService.getCustomerContacts(
        parseInt(req.params.id)
      );
      const message =
        contacts.length === 0
          ? "No contacts found"
          : "Contacts retrieved successfully";
      res.status(200).json({
        status: "success",
        message: message,
        data: contacts,
      });
    } catch (err) {
      next(err);
    }
  },
  showLeads: async (req, res, next) => {
    try {
      const leads = await customerService.getCustomerLeads(
        parseInt(req.params.id)
      );
      const message =
        leads.length === 0 ? "No leads found" : "Leads retrieved successfully";
      res.status(200).json({
        status: "success",
        message: message,
        data: leads,
      });
    } catch (err) {
      next(err);
    }
  },
  showOpportunities: async (req, res, next) => {
    try {
      const opportunities = await customerService.getCustomerOpportunities(
        parseInt(req.params.id)
      );
      const message =
        opportunities.length === 0
          ? "No opportunities found"
          : "Opportunities retrieved successfully";
      res.status(200).json({
        status: "success",
        message: message,
        data: opportunities,
      });
    } catch (err) {
      next(err);
    }
  },
  showSales: async (req, res, next) => {
    try {
      const sales = await customerService.getCustomerSales(
        parseInt(req.params.id)
      );
      const message =
        sales.length === 0 ? "No sales found" : "Sales retrieved successfully";
      res.status(200).json({
        status: "success",
        message: message,
        data: sales,
      });
    } catch (err) {
      next(err);
    }
  },
  showCustomerActivities: async (req, res, next) => {
    try {
      const activities = await customerService.getCustomerActivities(
        parseInt(req.params.id)
      );
      const message =
        activities.length === 0
          ? "No activities found"
          : "Activities retrieved successfully";
      res.status(200).json({
        status: "success",
        message: message,
        data: activities,
      });
    } catch (err) {
      next(err);
    }
  },
  showCustomerNotes: async (req, res, next) => {
    try {
      const notes = await customerService.getCustomerNotes(
        parseInt(req.params.id)
      );
      const message =
        notes.length === 0 ? "No notes found" : "Notes retrieved successfully";
      res.status(200).json({
        status: "success",
        message: message,
        data: notes,
      });
    } catch (err) {
      next(err);
    }
  },
};

export default customerController;
