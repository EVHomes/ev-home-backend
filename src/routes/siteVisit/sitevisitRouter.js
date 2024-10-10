import { Router } from "express";
import {
  addSiteVisits,
  getSiteVisits,
  getSiteVisitsById,
} from "../../controller/siteVisit.controller.js";
import { authenticateToken } from "../../middleware/auth.middleware.js";

const siteVisitRouter = Router();
siteVisitRouter.get("/siteVisit", authenticateToken, getSiteVisits);
siteVisitRouter.get("/siteVisit/:id", authenticateToken, getSiteVisitsById);
siteVisitRouter.post("/siteVisits-add", authenticateToken, addSiteVisits);
export default siteVisitRouter;
