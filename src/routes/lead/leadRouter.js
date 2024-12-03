import { Router } from "express";
import {
  addLead,
  assignLeadToPreSaleExecutive,
  checkLeadsExists,
  deleteLead,
  getAllLeads,
  getLeadById,
  getLeadsTeamLeader,
  getSimilarLeadsById,
  searchLeads,
  updateLead,
  getLeadsPreSalesExecutive,
  updateCallHistoryPreSales,
  getLeadCounts,
  getLeadCountsByTeamLeaders,
  getAllLeadCountsFunnel,
  getLeadCountsByChannelPartner,
  getLeadCountsByTeamLeader,
  getLeadCountsByPreSaleExecutve,
  getAllLeadCountsFunnelForPreSaleTL,
  rejectLeadById,
  leadAssignToTeamLeader,
  getLeadTeamLeaderGraph,
} from "../../controller/lead.controller.js";
import { authenticateToken } from "../../middleware/auth.middleware.js";
import { validateLeadsFields } from "../../middleware/lead.middleware.js";

const leadRouter = Router();

leadRouter.get("/leads", authenticateToken, getAllLeads);
leadRouter.get(
  "/leads-team-leader/:id",
  // authenticateToken,
  getLeadsTeamLeader
);

leadRouter.get(
  "/leads-team-leader-graph/:id",
  // authenticateToken,
  getLeadTeamLeaderGraph
);

leadRouter.get("/leads-pre-sales-executive/:id", getLeadsPreSalesExecutive);

leadRouter.post(
  "/lead-update-caller/:id",
  authenticateToken,
  updateCallHistoryPreSales
);
leadRouter.get(
  "/search-lead",
  //  authenticateToken,
  searchLeads
);

leadRouter.get("/lead/:id", authenticateToken, getLeadById);

leadRouter.get("/similar-leads/:id", authenticateToken, getSimilarLeadsById);

leadRouter.post(
  "/lead-assign-tl/:id",
  authenticateToken,
  leadAssignToTeamLeader
);
leadRouter.post("/lead-reject/:id", authenticateToken, rejectLeadById);

leadRouter.post(
  "/lead-assign-pre-sale-executive/:id",
  authenticateToken,
  assignLeadToPreSaleExecutive
);

leadRouter.post("/leads-add", validateLeadsFields, addLead);
leadRouter.post("/lead-update/:id", authenticateToken, updateLead);
leadRouter.delete("/lead/:id", authenticateToken, deleteLead);
leadRouter.get(
  "/leads-exists/:phoneNumber",
  authenticateToken,
  checkLeadsExists
);

//for data analyser
leadRouter.get("/lead-count", getLeadCounts);

leadRouter.get(
  "/lead-count-pre-sale-team-leader-for-data-analyser",
  getLeadCountsByTeamLeaders
);
leadRouter.get("/lead-count-channel-partners", getLeadCountsByChannelPartner);
leadRouter.get("/lead-count-funnel", getAllLeadCountsFunnel);

//pre sales team leader
leadRouter.get(
  "/lead-count-pre-sale-team-leader/:id",
  getLeadCountsByTeamLeader
);

leadRouter.get(
  "/lead-count-pre-sale-executive-for-pre-sale-tl",
  getLeadCountsByPreSaleExecutve
);
leadRouter.get(
  "/lead-count-funnel-pre-sales-tl",
  getAllLeadCountsFunnelForPreSaleTL
);

leadRouter.get(
  "/similar-leads2",
  // authenticateToken,
  checkLeadsExists
);

export default leadRouter;
