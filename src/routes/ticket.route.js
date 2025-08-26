import express from "express";
import ticketController from "./../controllers/ticket.controller.js";
import authMiddleware from "./../middlewares/auth.middleware.js";
import validate from "./../middlewares/validate.middleware.js";
import {
  createTicketScheme,
  updateTicketScheme,
  ticketIdScheme,
  ticketStatusScheme,
} from "./../validators/ticket.validator.js";
import { documentIdScheme } from "./../validators/document.validator.js";
import policyMiddleware from "./../middlewares/policy.middleware.js";
import ticketPolicy from "./../policies/ticket.policy.js";

const router = express.Router();

router.use(authMiddleware);

router.get(
  "/",
  policyMiddleware(ticketPolicy, "canViewAll"),
  validate(ticketStatusScheme, "query"),
  ticketController.index
);

router.get("/my-tickets", ticketController.showByAssignedUser);

router.get(
  "/creators/:id",
  policyMiddleware(ticketPolicy, "canViewAll"),
  validate(ticketIdScheme, "params"),
  ticketController.showByCreator
);

router.get(
  "/:id",
  policyMiddleware(ticketPolicy, "canView"),
  validate(ticketIdScheme, "params"),
  ticketController.show
);

router.post(
  "/",
  policyMiddleware(ticketPolicy, "canCreate"),
  validate(createTicketScheme),
  ticketController.create
);

router.post(
  "/:id/solve",
  policyMiddleware(ticketPolicy, "canUpdate"),
  validate(ticketIdScheme, "params"),
  ticketController.solve
);

router.patch(
  "/:id",
  policyMiddleware(ticketPolicy, "canUpdate"),
  validate(ticketIdScheme, "params"),
  validate(updateTicketScheme),
  ticketController.update
);

router.delete(
  "/:id",
  policyMiddleware(ticketPolicy, "canDelete"),
  validate(ticketIdScheme, "params"),
  ticketController.destroy
);

router.get(
  "/:id/documents",
  policyMiddleware(ticketPolicy, "canView"),
  validate(ticketIdScheme, "params"),
  ticketController.getDocumentsForTicket
);

router.post(
  "/:id/documents/:documentId",
  policyMiddleware(ticketPolicy, "canUpdate"),
  validate(ticketIdScheme, "params"),
  validate(documentIdScheme, "params"),
  ticketController.addDocumentToTicket
);

router.delete(
  "/:id/documents/:documentId",
  policyMiddleware(ticketPolicy, "canUpdate"),
  validate(ticketIdScheme, "params"),
  validate(documentIdScheme, "params"),
  ticketController.removeDocumentFromTicket
);

export default router;
