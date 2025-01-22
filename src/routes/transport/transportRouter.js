import { Router } from "express";
import {
  addTransport,
  approveTransport,
  completedTransport,
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

transPortRouter.post(
  "/approve-transport/:id",
  // auth,
  approveTransport
);

transPortRouter.post(
  "/transport-complete/:id",
  // authenticateToken,
  completedTransport
);

export default transPortRouter;
