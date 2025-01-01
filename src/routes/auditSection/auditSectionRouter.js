import { Router } from "express";
import {
  addAuditSection,
  getAuditSectionByExecutive,
  getAuditSections,
} from "../../controller/auditSection.controller.js";
const auditSectionRouter = Router();

auditSectionRouter.get("/audit-sections", getAuditSections);
auditSectionRouter.post("/audit-section-add", addAuditSection);
auditSectionRouter.get(
  "/audit-section-by-executive/:id",
  getAuditSectionByExecutive
);

export default auditSectionRouter;
