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
  update: async (req, res, next) => {
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

  convertLead: async (req, res, next) => {
    try {
      const result = await leadService.convertLead(
        parseInt(req.params.id),
        req.user.id
      );
      res.status(200).json({
        status: "success",
        message: "Lead converted successfully",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },
  showOpportunities: async (req, res, next) => {
    try {
      const opportunities = await leadService.getOpportunitiesByLeadId(
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
  showActivities: async (req, res, next) => {
    try {
      const activities = await leadService.getActivitiesByLeadId(
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
  showNotes: async (req, res, next) => {
    try {
      const notes = await leadService.getNotesByLeadId(parseInt(req.params.id));
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

export default leadController;
