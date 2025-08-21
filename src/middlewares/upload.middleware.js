import multer from "multer";
import path from "path";
import fsPromises from "fs/promises";
import { AppError } from "./../utils/AppError.js";

const baseDir = process.cwd();
const baseUploadDir = path.join(baseDir, "uploads", "documents");

const checkDir = async (dirPath) => {
  try {
    await fsPromises.access(dirPath);
  } catch (error) {
    await fsPromises.mkdir(dirPath, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const isTesting = req.query.isTesting === "true";
      const targetDir = isTesting
        ? path.join(baseUploadDir, "tests")
        : baseUploadDir;

      await checkDir(targetDir);

      cb(null, targetDir);
    } catch (err) {
      cb(err);
    }
  },
  filename: (req, file, cb) => {
    const isTesting = req.query.isTesting === "true";

    if (isTesting) {
      cb(null, file.originalname);
    } else {
      cb(
        null,
        `${req.body.documentType}${Date.now()}${path.extname(
          file.originalname
        )}`
      );
    }
  },
});

const upload = multer({
  storage,
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
      req.fileValidationError = "Invalid file type";
      return cb(null, false, new Error("Invalid file type"));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

export default upload;
