import { Router } from "express";
import { authenticateToken } from "../../middleware/auth.middleware.js";
import {
  addFaceId,
  getFaceIdById,
  getFaceIds,
} from "../../controller/faceId.controller.js";
const faceIdRouter = Router();

faceIdRouter.get("/face-id", getFaceIds);
faceIdRouter.post("/add-face-id", addFaceId);
faceIdRouter.get("/face-id/:id", getFaceIdById);

export default faceIdRouter;
