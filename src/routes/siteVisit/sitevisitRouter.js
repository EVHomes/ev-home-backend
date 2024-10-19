import { Router } from "express";
import {
  addSiteVisits,
  deleteSiteVisits,
  getSiteVisits,
  getSiteVisitsById,
  searchSiteVisits,
  updateSiteVisits,
} from "../../controller/siteVisit.controller.js";
import { authenticateToken } from "../../middleware/auth.middleware.js";

const siteVisitRouter = Router();
siteVisitRouter.get(
  "/siteVisit",

  // authenticateToken,
  getSiteVisits
);
siteVisitRouter.get("/siteVisit/:id", authenticateToken, getSiteVisitsById);
siteVisitRouter.post(
  "/siteVisits-add",
  // authenticateToken,
  addSiteVisits
);
siteVisitRouter.post(
  "/siteVisit-update/:id",
  authenticateToken,
  updateSiteVisits
);
siteVisitRouter.delete("/siteVisit/:id", authenticateToken, deleteSiteVisits);
siteVisitRouter.get("/siteVisits-search", searchSiteVisits);

export default siteVisitRouter;
