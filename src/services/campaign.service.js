import campaignRepository from "../repositories/campaign.repository.js";
import leadRepository from "../repositories/lead.repository.js";
import { AppError } from "../utils/AppError.js";

const campaignService = {
  getAllCampaigns: async (queryFilter) => {
    return await campaignRepository.all(queryFilter);
  },
  getCampaignById: async (campaignId) => {
    const campaign = await campaignRepository.findById(campaignId);
    if (!campaign) {
      throw new AppError("Campaign not found", 404);
    }
    return campaign;
  },
  createCampaign: async (userId, requestData) => {
    const { startDate, endDate } = requestData;
    if (startDate > endDate) {
      throw new AppError("Start date cannot be greater than end date", 400);
    }
    return await campaignRepository.create({
      ...requestData,
      createdByUserId: userId,
    });
  },
  updateCampaign: async (id, requestData) => {
    const campaign = await campaignRepository.findById(id);
    if (!campaign) {
      throw new AppError("Campaign not found", 404);
    }
    let startDate = campaign.startDate;
    let endDate = campaign.endDate;
    if (requestData.startDate) {
      startDate = requestData.startDate;
    }
    if (requestData.endDate) {
      endDate = requestData.endDate;
    }
    if (startDate > endDate) {
      throw new AppError("Start date cannot be greater than end date", 400);
    }
    return await campaignRepository.update(id, requestData);
  },
  deleteCampaign: async (id) => {
    const campaign = await campaignRepository.findById(id);
    if (!campaign) {
      throw new AppError("Campaign not found", 404);
    }
    return await campaignRepository.softDelete(id);
  },
  getLeadByCampaignId: async (id) => {
    const campaign = await campaignRepository.findById(id);
    if (!campaign) {
      throw new AppError("Campaign not found", 404);
    }
    return await leadRepository.findByCampaignId(id);
  },
};

export default campaignService;
