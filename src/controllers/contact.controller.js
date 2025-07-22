import contactService from "../services/contact.service.js";
const contactController = {
  createContact: async (req, res, next) => {
    try {
      const contact = await contactService.createContact(req.user.id, req.body);
      res.status(201).json({
        status: "success",
        message: "Contact created successfully",
        data: contact,
      });
    } catch (err) {
      next(err);
    }
  },
  getAllContacts: async (req, res, next) => {
    try {
      const contacts = await contactService.getAllContacts(req.user.id);
      const message =
        contacts.length === 0
          ? "No contacts found"
          : "Contacts retrieved successfully";
      res.status(200).json({
        status: "success",
        message: message,
        data: contacts,
      });
    } catch (err) {
      next(err);
    }
  },
  getContact: async (req, res, next) => {
    try {
      const contactId = parseInt(req.params.id);
      const contact = await contactService.getContact(contactId);
      res.status(200).json({
        status: "success",
        message: "Contact retrieved successfully",
        data: contact,
      });
    } catch (err) {
      next(err);
    }
  },
  updateContact: async (req, res, next) => {
    try {
      const contactId = parseInt(req.params.id);
      const contact = await contactService.updateContact(contactId, req.body);
      res.status(200).json({
        status: "success",
        message: "Contact updated successfully",
        data: contact,
      });
    } catch (err) {
      next(err);
    }
  },
  deleteContact: async (req, res, next) => {
    try {
      const contactId = parseInt(req.params.id);
      await contactService.deleteContact(contactId);
      res.status(200).json({
        status: "success",
        message: "Contact deleted successfully",
      });
    } catch (err) {
      next(err);
    }
  },
};

export default contactController;
