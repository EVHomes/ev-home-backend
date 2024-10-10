import { Router } from "express";
import { addSiteVisits, getSiteVisits, getSiteVisitsById } from "../../controller/siteVisit.controller.js";

const siteVisitRouter=Router();
siteVisitRouter.get("/siteVisit",getSiteVisits);
siteVisitRouter.get("/siteVisit/:id",getSiteVisitsById);
siteVisitRouter.post("/siteVisits-add",addSiteVisits);
export default siteVisitRouter;
