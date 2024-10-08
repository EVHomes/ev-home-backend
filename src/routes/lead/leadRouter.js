import { Router } from "express";
import { getAllLeads, getLeadById } from "../../controller/lead.controller.js";

const leadRouter = Router();
leadRouter.get("/leads", getAllLeads);
leadRouter.get("/lead/:id", getLeadById);
export default leadRouter;
