import { Router } from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

import jwt from "jsonwebtoken";
import config from "../../config/config.js";
import {
  deleteFile,
  getFileLink,
  uploadFile,
  uploadMultiple,
} from "../../controller/storage.controller.js";

// Manually define __dirname for ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadsDir =
  config.STORAGE_ABSOLUTE_PATH ?? path.resolve(__dirname, "../../../uploads");
// console.log(uploadsDir);
// Multer setup for file uploads
export const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
});
const storageRouter = Router();

function verifyTokenFromURL(req, res, next) {
  const token = req.query.token;
  if (!token) return res.sendStatus(403);

  jwt.verify(token, config.SECRET_STORAGE_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

storageRouter.post("/upload", upload.single("file"), uploadFile);

storageRouter.post("/uploads", upload.array("files", 10), uploadMultiple);

storageRouter.get("/file/:filename", verifyTokenFromURL, getFileLink);

// Route to delete a file
storageRouter.delete("/:filename", verifyTokenFromURL, deleteFile);

export default storageRouter;
