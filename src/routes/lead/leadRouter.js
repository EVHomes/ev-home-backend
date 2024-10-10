import { Router } from "express";
import {
  addLead,
  checkLeadsExists,
  deleteLead,
  getAllLeads,
  getLeadById,
  updateLead,
} from "../../controller/lead.controller.js";

const leadRouter = Router();
leadRouter.get("/leads", getAllLeads);
leadRouter.get("/lead/:id", getLeadById);
leadRouter.post("/leads-add", addLead);
leadRouter.post("/lead-update/:id", updateLead);
leadRouter.delete("/lead/:id", deleteLead);
leadRouter.get("/leads-exists/:phoneNumber",checkLeadsExists);

export default leadRouter;
