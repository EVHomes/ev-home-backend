import { Router } from "express";
import {
  addTransport,
  getTransports,
} from "../../controller/transport.controller.js";
const transPortRouter = Router();
transPortRouter.post(
  "/add-transport",
  // authenticateToken,
  addTransport
);

transPortRouter.get(
  "/get-transport",
  // authenticateToken,
  getTransports
);

export default transPortRouter;
