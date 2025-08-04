import dashboardRepository from "./../repositories/dashboard.repository.js";
import { AppError } from "../utils/AppError.js";
import saleRepository from "./../repositories/sale.repository.js";
import leadRepository from "./../repositories/lead.repository.js";
import opportunityRepository from "../repositories/opportunity.repository.js";
import userRepository from "../repositories/user.repository.js";
import customerRepository from "../repositories/customer.repository.js";
import taskRepository from "../repositories/task.repository.js";
import activityRepository from "../repositories/activity.repository.js";
const getSalesData = async (user) => {
  const saleResult = await saleRepository.calculateTotalSaleByUserId(user.id);
  const newLeadResult = await leadRepository.countNewLeadsByUserId(user.id);
  const openOpportunityCount =
    await opportunityRepository.countOpenOpportunitiesByUserId(user.id);
  return {
    totalSales: saleResult,
    newLeads: newLeadResult,
    openOpportunities: openOpportunityCount,
  };
};

const getManagerData = async () => {
  const saleResult = await saleRepository.calculateTotalRevenue();
  const newLeadResult = await leadRepository.countNewsLeads();
  const openOpportunityCount =
    await opportunityRepository.countOpenOpportunities();
  return {
    totalSales: saleResult,
    newLeads: newLeadResult,
    openOpportunities: openOpportunityCount,
  };
};
const getAdminDashboard = async () => {
  const totalRevenue = await saleRepository.calculateTotalRevenue();
  const totalLeads = await leadRepository.countLeads();
  const totalUser = await userRepository.countActiveUser();
  const totalOpenOpportunities =
    await opportunityRepository.countOpenOpportunities();
  const totalCustomers = await customerRepository.countCustomers();
  const pendingTask = await taskRepository.countPending();
  const recentActivities = await activityRepository.recentActivities();
  return {
    totalRevenue,
    totalLeads,
    totalUser,
    totalOpenOpportunities,
    totalCustomers,
    pendingTask,
    recentActivities,
  };
};
const dashboardService = {
  getDashboard: async (user) => {
    let dashboard = await dashboardRepository.findByUserId(user.id);
    if (!dashboard) {
      const defaultDashboard = {
        name: `${user.username}'s Dashboard`,
        description: "Default dashboard view",
        layout: {
          widgets: [],
        },
      };
      dashboard = await dashboardRepository.create({
        ...defaultDashboard,
        userId: user.id,
      });
    }
    let dynamicData = {};
    if (user.role === "ADMIN") {
      dynamicData = await getAdminDashboard();
    } else if (user.role === "MANAGER") {
      dynamicData = await getManagerData();
    } else if (user.role === "SALES") {
      dynamicData = await getSalesData(user);
    } else {
      dynamicData = { message: "Welcome. No special data for your role." };
    }
    return {
      dashboard,
      dynamicData,
    };
  },
  updateDashboard: async (userId, data) => {
    const existingDashboard = await dashboardRepository.findByUserId(userId);
    if (!existingDashboard) {
      throw new AppError("Dashboard not found", 404);
    }
    return dashboardRepository.update(userId, data);
  },
};

export default dashboardService;
