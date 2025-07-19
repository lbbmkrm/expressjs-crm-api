import leadService from "../services/lead.service.js";

const leadController = {
  create: async (req, res) => {
    const user = req.user;
    try {
      const lead = await leadService.createLead(user.id, req.body);
      res.status(201).json({
        status: "Success",
        message: "Lead created successfully",
        data: lead,
      });
    } catch (err) {
      res.status(err.statusCode || 500).json({
        status: "Error",
        message: err.message,
      });
    }
  },
  index: async (req, res) => {
    try {
      const leads = await leadService.getAllLeads();
      res.status(200).json({
        status: "Success",
        message: "Leads retieved successfully",
        data: leads,
      });
    } catch (err) {
      res.status(err.statusCode || 500).json({
        status: "Error",
        message: err.message,
      });
    }
  },
  show: async (req, res) => {
    try {
      const leadId = parseInt(req.params.id);
      const lead = await leadService.getLeadById(leadId);
      res.status(200).json({
        status: "Success",
        message: "Lead retrieved successfully",
        data: lead,
      });
    } catch (err) {
      res.status(err.statusCode || 500).json({
        status: "Error",
        message: err.message,
      });
    }
  },
  update: async (req, res) => {
    try {
      const leadId = parseInt(req.params.id);
      const lead = await leadService.updateLead(leadId, req.body);
      res.status(200).json({
        status: "Success",
        message: "Lead updated successfully",
        data: lead,
      });
    } catch (err) {
      res.status(err.statusCode).json({
        status: "Error",
        message: err.message,
      });
    }
  },
  delete: async (req, res) => {
    try {
      await leadService.deleteLead(parseInt(req.params.id));
      res.status(200).json({
        status: "Success",
        message: "Lead deleted successfully",
      });
    } catch (err) {
      res.status(err.statusCode || 500).json({
        status: "Error",
        message: err.message,
      });
    }
  },
};

export default leadController;
