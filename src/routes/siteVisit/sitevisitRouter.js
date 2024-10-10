import { Router } from "express";
import {
  addSiteVisits,
  deleteSiteVisits,
  getSiteVisits,
  getSiteVisitsById,
  updateSiteVisits,
} from "../../controller/siteVisit.controller.js";

const siteVisitRouter = Router();
siteVisitRouter.get("/siteVisit", getSiteVisits);
siteVisitRouter.get("/siteVisit-id/:id", getSiteVisitsById);
siteVisitRouter.post("/siteVisits-add", addSiteVisits);
siteVisitRouter.post("/siteVisit-update/:id", updateSiteVisits);
siteVisitRouter.delete("/siteVisit/:id", deleteSiteVisits);

export default siteVisitRouter;
