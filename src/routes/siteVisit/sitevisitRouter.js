import { Router } from "express";
import {
  addSiteVisits,
  deleteSiteVisits,
  updateSiteVisits,
  getSiteVisits,
  getSiteVisitsById,
} from "../../controller/siteVisit.controller.js";
import { authenticateToken } from "../../middleware/auth.middleware.js";

const siteVisitRouter = Router();
siteVisitRouter.get("/siteVisit", authenticateToken, getSiteVisits);
siteVisitRouter.get("/siteVisit/:id", authenticateToken, getSiteVisitsById);
siteVisitRouter.post("/siteVisits-add", authenticateToken, addSiteVisits);
siteVisitRouter.post("/siteVisit-update/:id", updateSiteVisits);
siteVisitRouter.delete("/siteVisit/:id", deleteSiteVisits);

export default siteVisitRouter;
