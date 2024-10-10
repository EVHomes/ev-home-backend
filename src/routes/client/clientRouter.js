import { Router } from "express";
import {
  addClient,
  deleteClient,
  getClientById,
  getClients,
  updateClient,
} from "../../controller/client.controller.js";
import { authenticateToken } from "../../middleware/auth.middleware.js";

const clientRouter = Router();
clientRouter.get("/client", authenticateToken, getClients);
clientRouter.get("/client:/id", authenticateToken, getClientById);
clientRouter.post("/client-add", authenticateToken, addClient);
clientRouter.post("/client-update/:id", authenticateToken, updateClient);
clientRouter.delete("/client/:id", authenticateToken, deleteClient);

export default clientRouter;
