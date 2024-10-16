import { Router } from "express";
import {
  addLead,
  assignLeadToTeamLeader,
  checkLeadsExists,
  deleteLead,
  getAllLeads,
  getLeadById,
  searchLeads,
  updateLead,
  // getAllLeadsWithValidity
} from "../../controller/lead.controller.js";
import { authenticateToken } from "../../middleware/auth.middleware.js";

const leadRouter = Router();
leadRouter.get("/leads", authenticateToken, getAllLeads);
leadRouter.get("/search-lead", authenticateToken, searchLeads);

leadRouter.get("/lead/:id", authenticateToken, getLeadById);
leadRouter.post(
  "/lead-assign-tl/:id",
  // authenticateToken,
  assignLeadToTeamLeader
);
leadRouter.post("/leads-add", authenticateToken, addLead);
leadRouter.post("/lead-update/:id", authenticateToken, updateLead);
leadRouter.delete("/lead/:id", authenticateToken, deleteLead);
leadRouter.get(
  "/leads-exists/:phoneNumber",
  authenticateToken,
  checkLeadsExists
);
// leadRouter.get("/lead-valid",getAllLeadsWithValidity);

export default leadRouter;
