import productService from "../services/product.service.js";

const productController = {
  index: async (req, res, next) => {
    try {
      const products = await productService.getAllProducts();
      const message =
        products.length === 0
          ? "No products found"
          : "Products retrieved successfully";
      res.status(200).json({
        status: "success",
        message: message,
        data: products,
      });
    } catch (err) {
      next(err);
    }
  },
  show: async (req, res, next) => {
    try {
      const productId = parseInt(req.params.id);
      const product = await productService.getProduct(productId);
      res.status(200).json({
        status: "success",
        message: "Product retrieved successfully",
        data: product,
      });
    } catch (err) {
      next(err);
    }
  },
  create: async (req, res, next) => {
    try {
      const product = await productService.createProduct(req.user.id, req.body);
      res.status(201).json({
        status: "success",
        message: "Product created successfully",
        data: product,
      });
    } catch (err) {
      next(err);
    }
  },
  update: async (req, res, next) => {
    try {
      const productId = parseInt(req.params.id);
      const product = await productService.updateProduct(productId, req.body);
      res.status(200).json({
        status: "success",
        message: "Product updated successfully",
        data: product,
      });
    } catch (err) {
      next(err);
    }
  },
  destroy: async (req, res, next) => {
    try {
      const productId = parseInt(req.params.id);
      await productService.deleteProduct(productId);
      res.status(200).json({
        status: "success",
        message: "Product deleted successfully",
      });
    } catch (err) {
      next(err);
    }
  },
};
export default productController;
