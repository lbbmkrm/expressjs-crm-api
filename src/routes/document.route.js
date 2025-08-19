import express from "express";
import documentController from "../controllers/document.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import policyMiddleware from "../middlewares/policy.middleware.js";
import documentPolicy from "../policies/document.policy.js";
import validate from "../middlewares/validate.middleware.js";
import {
  createDocumentScheme,
  updateDocumentScheme,
  documentIdScheme,
  documentFilterScheme,
} from "./../validators/document.validator.js";
import documentService from "../services/document.service.js";
import uploadMiddleware from "./../middlewares/upload.middleware.js";
const router = express.Router();

router.use(authMiddleware);

router.get(
  "/",
  validate(documentFilterScheme, "query"),
  policyMiddleware(documentPolicy, "canViewAll"),
  documentController.index
);

router.get(
  "/:id",
  validate(documentIdScheme, "params"),
  policyMiddleware(documentPolicy, "canView"),
  documentController.show
);

router.post(
  "/",
  uploadMiddleware.single("file"),
  validate(createDocumentScheme),
  policyMiddleware(documentPolicy, "canCreate"),
  documentController.create
);

router.patch(
  "/:id",
  uploadMiddleware.single("file"),
  validate(documentIdScheme, "params"),
  validate(updateDocumentScheme),
  policyMiddleware(documentPolicy, "canUpdate", {
    needModel: true,
    serviceMethod: documentService.getDocumentById,
  }),
  documentController.update
);

router.delete(
  "/:id",
  validate(documentIdScheme, "params"),
  policyMiddleware(documentPolicy, "canDelete", {
    needModel: true,
    serviceMethod: documentService.getDocumentById,
  }),
  documentController.destroy
);

export default router;
