import contactService from "../services/contact.service.js";
const contactController = {
  index: async (req, res, next) => {
    try {
      const contacts = await contactService.getAllContacts();
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
  show: async (req, res, next) => {
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
  create: async (req, res, next) => {
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
  update: async (req, res, next) => {
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
  destroy: async (req, res, next) => {
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
  showActivities: async (req, res, next) => {
    try {
      const activities = await contactService.getContactActivites(
        parseInt(req.params.id)
      );
      const message =
        activities.length === 0
          ? "No activities found"
          : "Activities retrieved successfully";
      res.status(200).json({
        status: "success",
        message: message,
        data: activities,
      });
    } catch (err) {
      next(err);
    }
  },
  showNotes: async (req, res, next) => {
    try {
      const notes = await contactService.getContactNotes(
        parseInt(req.params.id)
      );
      const message =
        notes.length === 0 ? "No notes found" : "Notes retrieved successfully";
      res.status(200).json({
        status: "success",
        message: message,
        data: notes,
      });
    } catch (err) {
      next(err);
    }
  },
};

export default contactController;
