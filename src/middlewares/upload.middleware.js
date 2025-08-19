import multer from "multer";
import path from "path";
import fsPromises from "fs/promises";
import { AppError } from "./../utils/AppError.js";

const baseDir = process.cwd();
const uploadDir = path.join(baseDir, "uploads/documents");
const checkDir = async () => {
  try {
    await fsPromises.access(uploadDir);
  } catch (error) {
    await fsPromises.mkdir(uploadDir, { recursive: true });
  }
};
checkDir();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/plain",
      "text/csv",
      "application/vnd.ms-powerpoint",
      "image/jpeg",
      "image/png",
      "application/zip",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      return cb(new AppError("Invalid file type", 400));
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

export default upload;
