import { Router } from "express";
import { addClient, deleteClient, getClientById, getClients, updateClient } from "../../controller/client.controller.js";

const clientRouter=Router();
clientRouter.get("/client",getClients);
clientRouter.get("/client:/id",getClientById);
clientRouter.post("/client-add",addClient);
clientRouter.post("/client-update/:id",updateClient);
clientRouter.delete("/client/:id",deleteClient);

export default clientRouter;
