import productRepository from "../repositories/product.repository.js";
import { AppError } from "../utils/AppError.js";

const productService = {
  getAllProducts: async () => {
    return productRepository.all();
  },
  getProduct: async (id) => {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new AppError("Product not found", 404);
    }
    return product;
  },
  createProduct: async (userId, requestData) => {
    const productData = {
      ...requestData,
      createdByUserId: userId,
    };
    return productRepository.create(productData);
  },
  updateProduct: async (id, requestData) => {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new AppError("Product not found", 404);
    }
    return productRepository.update(id, requestData);
  },
  deleteProduct: async (id) => {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new AppError("Product not found", 404);
    }
    return productRepository.delete(id);
  },
};

export default productService;
