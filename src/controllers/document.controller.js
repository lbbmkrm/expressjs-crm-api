import documentService from "../services/document.service.js";

const documentController = {
  index: async (req, res, next) => {
    try {
      const documents = await documentService.getAllDocuments(req.query.type);
      const message =
        documents.length === 0
          ? "No documents found"
          : "Documents retrieved successfully";
      res.status(200).json({
        status: "success",
        message: message,
        data: documents,
      });
    } catch (err) {
      next(err);
    }
  },
  show: async (req, res, next) => {
    try {
      const document = await documentService.getDocumentById(
        parseInt(req.params.id)
      );
      res.status(200).json({
        status: "success",
        message: "Document retrieved successfully",
        data: document,
      });
    } catch (err) {
      next(err);
    }
  },
  create: async (req, res, next) => {
    try {
      if (req.fileValidationError) {
        throw new AppError(req.fileValidationError, 400);
      }
      const document = await documentService.createDocument(
        req.user.id,
        req.file,
        req.body
      );
      res.status(201).json({
        status: "success",
        message: "Document created successfully",
        data: document,
      });
    } catch (err) {
      next(err);
    }
  },
  update: async (req, res, next) => {
    try {
      if (req.fileValidationError) {
        throw new AppError(req.fileValidationError, 400);
      }
      const document = await documentService.updateDocument(
        parseInt(req.params.id),
        req.file,
        req.body
      );
      res.status(200).json({
        status: "success",
        message: "Document updated successfully",
        data: document,
      });
    } catch (err) {
      next(err);
    }
  },
  destroy: async (req, res, next) => {
    try {
      await documentService.deleteDocument(parseInt(req.params.id));
      res.status(200).json({
        status: "success",
        message: "Document deleted successfully",
      });
    } catch (err) {
      next(err);
    }
  },
};

export default documentController;
