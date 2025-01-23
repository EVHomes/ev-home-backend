import { Router } from "express";
import {
  addTransport,
  approveTransport,
  completedTransport,
  getTransportById,
  getTransports,
  startJourney,
} from "../../controller/transport.controller.js";
const transPortRouter = Router();
transPortRouter.post(
  "/add-transport",
  // authenticateToken,
  addTransport
);

transPortRouter.get(
  "/get-transport",
  // authenticateTok
  getTransports
);

transPortRouter.get(
  "/get-transport-by-id/:id",
  // authenticateToken,
  getTransportById
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
transPortRouter.post("/transport-start-journey/:id", startJourney);

export default transPortRouter;
