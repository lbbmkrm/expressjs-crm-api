import campaignService from "../services/campaign.service.js";

const campaignController = {
  index: async (req, res, next) => {
    try {
      const campaigns = await campaignService.getAllCampaigns(req.query);
      const message =
        campaigns.length === 0
          ? "No campaigns found"
          : "Campaigns retrieved successfully";
      res.status(200).json({
        status: "success",
        message: message,
        data: campaigns,
      });
    } catch (err) {
      next(err);
    }
  },
  show: async (req, res, next) => {
    try {
      const campaign = await campaignService.getCampaignById(
        parseInt(req.params.id)
      );
      res.status(200).json({
        status: "success",
        message: "Campaign retrieved successfully",
        data: campaign,
      });
    } catch (err) {
      next(err);
    }
  },
  create: async (req, res, next) => {
    try {
      const campaign = await campaignService.createCampaign(
        req.user.id,
        req.body
      );
      res.status(201).json({
        status: "success",
        message: "Campaign created successfully",
        data: campaign,
      });
    } catch (err) {
      next(err);
    }
  },
  update: async (req, res, next) => {
    try {
      const campaign = await campaignService.updateCampaign(
        parseInt(req.params.id),
        req.body
      );
      res.status(200).json({
        status: "success",
        message: "Campaign updated successfully",
        data: campaign,
      });
    } catch (err) {
      next(err);
    }
  },
  destroy: async (req, res, next) => {
    try {
      await campaignService.deleteCampaign(parseInt(req.params.id));
      res.status(200).json({
        status: "success",
        message: "Campaign deleted successfully",
      });
    } catch (err) {
      next(err);
    }
  },
  showLeads: async (req, res, next) => {
    try {
      const leads = await campaignService.getLeadByCampaignId(
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
};

export default campaignController;
