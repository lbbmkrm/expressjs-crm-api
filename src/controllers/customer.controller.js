import customerService from "../services/customer.service.js";

const customerController = {
  getAllCustomers: async (req, res) => {
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
      res.status(err.statusCode || 500).json({
        status: "error",
        message: err.message,
      });
    }
  },
  getCustomer: async (req, res) => {
    try {
      const customerId = parseInt(req.params.id);
      const customer = await customerService.getCustomer(customerId);
      res.status(200).json({
        status: "success",
        message: "Customer retrieved successfully",
        data: customer,
      });
    } catch (err) {
      res.status(err.statusCode || 404).json({
        status: "error",
        message: err.message,
      });
    }
  },
  createCustomer: async (req, res) => {
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
      res.status(err.statusCode || 400).json({
        status: "error",
        message: err.message,
      });
    }
  },
  updateCustomer: async (req, res) => {
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
      res.status(err.statusCode || 400).json({
        status: "error",
        message: err.message,
      });
    }
  },
  deleteCustomer: async (req, res) => {
    try {
      const customerId = parseInt(req.params.id);
      await customerService.deleteCustomer(customerId);
      res.status(200).json({
        status: "success",
        message: "Customer deleted successfully",
      });
    } catch (err) {
      res.status(err.statusCode || 404).json({
        status: "error",
        message: err.message,
      });
    }
  },
};

export default customerController;
