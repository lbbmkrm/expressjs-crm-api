import leadService from "../services/lead.service.js";

const leadController = {
  create: async (req, res, next) => {
    const user = req.user;
    try {
      const lead = await leadService.createLead(user.id, req.body);
      res.status(201).json({
        status: "success",
        message: "Lead created successfully",
        data: lead,
      });
    } catch (err) {
      next(err);
    }
  },
  index: async (req, res, next) => {
    try {
      const leads = await leadService.getAllLeads();
      res.status(200).json({
        status: "success",
        message: "Leads retrieved successfully",
        data: leads,
      });
    } catch (err) {
      next(err);
    }
  },
  indexByStatus: async (req, res, next) => {
    try {
      const leads = await leadService.getLeadsByStatus(req.params.status);
      res.status(200).json({
        status: "success",
        message: "Leads retrieved successfully",
        data: leads,
      });
    } catch (err) {
      next(err);
    }
  },
  show: async (req, res, next) => {
    try {
      const leadId = parseInt(req.params.id);
      const lead = await leadService.getLeadById(leadId);
      res.status(200).json({
        status: "success",
        message: "Lead retrieved successfully",
        data: lead,
      });
    } catch (err) {
      next(err);
    }
  },
  update: async (req, res) => {
    try {
      const leadId = parseInt(req.params.id);
      const lead = await leadService.updateLead(leadId, req.body);
      res.status(200).json({
        status: "success",
        message: "Lead updated successfully",
        data: lead,
      });
    } catch (err) {
      next(err);
    }
  },
  destroy: async (req, res, next) => {
    try {
      await leadService.deleteLead(parseInt(req.params.id));
      res.status(200).json({
        status: "success",
        message: "Lead deleted successfully",
      });
    } catch (err) {
      next(err);
    }
  },
};

export default leadController;
