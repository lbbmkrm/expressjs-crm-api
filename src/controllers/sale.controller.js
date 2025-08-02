import saleService from "../services/sale.service.js";

const saleController = {
  index: async (req, res, next) => {
    try {
      const sales = await saleService.getAllSales();
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
  show: async (req, res, next) => {
    try {
      const sale = await saleService.getSaleById(parseInt(req.params.id));
      res.status(200).json({
        status: "success",
        message: "Sale retrieved successfully",
        data: sale,
      });
    } catch (err) {
      next(err);
    }
  },
  create: async (req, res, next) => {
    try {
      const sale = await saleService.createSale(
        req.body,
        parseInt(req.user.id)
      );
      res.status(201).json({
        status: "success",
        message: "Sale created successfully",
        data: sale,
      });
    } catch (err) {
      next(err);
    }
  },
  update: async (req, res, next) => {
    try {
      const sale = await saleService.updateSaleStatus(
        parseInt(req.params.id),
        req.body
      );
      res.status(200).json({
        status: "success",
        message: "Sale updated successfully",
        data: sale,
      });
    } catch (err) {
      next(err);
    }
  },
};

export default saleController;
