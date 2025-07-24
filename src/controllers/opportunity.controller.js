import opportunityService from "../services/opportunity.service.js";

const opportunityController = {
  index: async (req, res, next) => {
    try {
      const opportunities = await opportunityService.getAllOpportunities();
      res.status(200).json({
        status: "success",
        message: "Opportunities retrieved successfully",
        data: opportunities,
      });
    } catch (err) {
      next(err);
    }
  },
  show: async (req, res, next) => {
    try {
      const opportunity = await opportunityService.getOpportunityById(
        parseInt(req.params.id)
      );
      res.status(200).json({
        status: "success",
        message: "Opportunity retrieved successfully",
        data: opportunity,
      });
    } catch (err) {
      next(err);
    }
  },
  create: async (req, res, next) => {
    try {
      const opportunity = await opportunityService.createOpportunity(
        req.user.id,
        req.body
      );
      res.status(201).json({
        status: "success",
        message: "Opportunity created successfully",
        data: opportunity,
      });
    } catch (err) {
      next(err);
    }
  },
  update: async (req, res, next) => {
    try {
      const opportunity = await opportunityService.updateOpportunity(
        parseInt(req.params.id),
        req.body
      );
      res.status(200).json({
        status: "success",
        message: "Opportunity updated successfully",
        data: opportunity,
      });
    } catch (err) {
      next(err);
    }
  },
  destroy: async (req, res, next) => {
    try {
      await opportunityService.deleteOpportunity(parseInt(req.params.id));
      res.status(200).json({
        status: "success",
        message: "Opportunity deleted successfully",
      });
    } catch (err) {
      next(err);
    }
  },
};

export default opportunityController;
