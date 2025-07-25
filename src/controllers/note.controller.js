import noteService from "../services/note.service.js";

const noteController = {
  index: async (req, res, next) => {
    try {
      const note = await noteService.getAllNotes();
      const message =
        note.length === 0 ? "No notes found" : "Notes retrieved successfully";
      res.status(200).json({
        status: "success",
        message: message,
        data: note,
      });
    } catch (err) {
      next(err);
    }
  },
  show: async (req, res, next) => {
    try {
      const note = await noteService.getNote(parseInt(req.params.id));
      res.status(200).json({
        status: "success",
        message: "Note retrieved successfully",
        data: note,
      });
    } catch (err) {
      next(err);
    }
  },
  create: async (req, res, next) => {
    try {
      const note = await noteService.createNote(req.user.id, req.body);
      res.status(201).json({
        status: "success",
        message: "Note created successfully",
        data: note,
      });
    } catch (err) {
      next(err);
    }
  },
  update: async (req, res, next) => {
    try {
      const note = await noteService.updateNote(
        parseInt(req.params.id),
        req.body
      );
      res.status(200).json({
        status: "success",
        message: "Note updated successfully",
        data: note,
      });
    } catch (err) {
      next(err);
    }
  },
  destroy: async (req, res, next) => {
    try {
      await noteService.deleteNote(parseInt(req.params.id));
      res.status(200).json({
        status: "success",
        message: "Note deleted successfully",
      });
    } catch (err) {
      next(err);
    }
  },
};
export default noteController;
