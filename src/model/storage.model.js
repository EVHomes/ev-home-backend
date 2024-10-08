import { Router } from "express";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import config from "../config/config.js";
import jwt from "jsonwebtoken";
// Multer setup for file uploads
export const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

export const upload = multer({ storage });

const storageRouter = Router();

// Middleware to verify token from URL
function verifyTokenFromURL(req, res, next) {
  const token = req.query.token;
  if (!token) return res.sendStatus(403);

  jwt.verify(token, config.SECRET_STORAGE_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}
// Route to upload file
storageRouter.post("/upload", upload.single("file"), (req, res) => {
  const uniqueFileName = req.file.filename;
  const token = jwt.sign(
    { filename: uniqueFileName },
    config.SECRET_STORAGE_KEY
  );
  console.log(token);
  console.log(uniqueFileName);
  res.json({
    message: "File uploaded successfully!",
    token,
    filename: uniqueFileName,
  });
});

// Route to access the file using token from the URL
storageRouter.get("/file/:filename", verifyTokenFromURL, (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "uploads", filename);

  // Send the file if it exists
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).send("File not found");
    }
  });
});

export default storageRouter;
