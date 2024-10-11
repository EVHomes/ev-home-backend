import { Router } from "express";
import {
  addLead,
  checkLeadsExists,
  deleteLead,
  getAllLeads,
  getLeadById,
  searchLeads,
  updateLead,
} from "../../controller/lead.controller.js";
import { authenticateToken } from "../../middleware/auth.middleware.js";

const leadRouter = Router();
// searchLeads
leadRouter.get("/leads", authenticateToken, getAllLeads);
leadRouter.get("/search-lead", authenticateToken, searchLeads);

leadRouter.get("/lead/:id", authenticateToken, getLeadById);
leadRouter.post("/leads-add", authenticateToken, addLead);
leadRouter.post("/lead-update/:id", authenticateToken, updateLead);
leadRouter.delete("/lead/:id", authenticateToken, deleteLead);
leadRouter.get(
  "/leads-exists/:phoneNumber",
  authenticateToken,
  checkLeadsExists
);

export default leadRouter;
