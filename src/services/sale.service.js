import saleRepository from "../repositories/sale.repository.js";
import { AppError } from "../utils/AppError.js";
import prisma from "../repositories/prismaClient.js";

const saleService = {
  getAllSales: async () => {
    return saleRepository.all();
  },
  getSaleById: async (id) => {
    const sale = await saleRepository.findById(id);
    if (!sale) {
      throw new AppError("Sale not found", 404);
    }
    return sale;
  },
  createSale: async (requestData, userId) => {
    const { customerId, opportunityId, items } = requestData;

    if (!customerId || !items || items.length === 0) {
      throw new AppError("Customer ID and at least one item are required", 400);
    }
    if (opportunityId) {
      const opportunity = await opportunityRepository.findById(opportunityId);
      if (!opportunity) {
        throw new AppError("Opportunity not found", 404);
      }
      const existingSale = await saleRepository.findByOpportunityId(
        opportunityId
      );
      if (existingSale) {
        throw new AppError("Opportunity already has a sale", 400);
      }
    }
    return prisma.$transaction(async (tx) => {
      const customer = await tx.customer.findUnique({
        where: { id: customerId, deletedAt: null },
      });
      if (!customer) {
        throw new AppError("Customer not found", 404);
      }

      let totalAmount = 0;
      const itemsDataForCreate = [];

      for (const item of items) {
        const product = await tx.product.findFirst({
          where: {
            id: item.productId,
            isActive: true,
          },
        });

        if (!product) {
          throw new AppError(
            `Product with ID ${item.productId} not found or is not active`,
            404
          );
        }

        if (item.quantity <= 0) {
          throw new AppError(
            `Quantity for product ID ${item.productId} must be positive`,
            400
          );
        }

        totalAmount += product.price * item.quantity;
        itemsDataForCreate.push({
          productId: product.id,
          quantity: item.quantity,
          unitPrice: product.price,
        });
      }

      const saleData = {
        customerId: customerId,
        opportunityId: opportunityId,
        totalAmount: totalAmount,
        createdByUserId: userId,
      };

      return tx.sale.create({
        data: {
          ...saleData,
          items: {
            create: itemsDataForCreate,
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          customer: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    });
  },
  updateSaleStatus: async (id, status) => {
    const sale = await saleRepository.findById(id);
    if (!sale) {
      throw new AppError("Sale not found", 404);
    }
    if (sale.status === "CANCELLED" || sale.status === "COMPLETED") {
      throw new AppError("Sale is already completed or cancelled", 400);
    }
    return saleRepository.update(id, status);
  },
};

export default saleService;
