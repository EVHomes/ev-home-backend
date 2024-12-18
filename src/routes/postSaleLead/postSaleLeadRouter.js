import { Router } from "express";
import {
  addPostSaleLead,
  getPostSaleLeadById,
  getPostSaleLeads,
  getPostSaleLeadsForExecutive,
  updatePostSaleLeadById,
  getPostSaleLeadByFlat,
} from "../../controller/postSaleLead.controller.js";
import { authenticateToken } from "../../middleware/auth.middleware.js";

const postSaleRouter = Router();
postSaleRouter.get("/post-sale-leads", authenticateToken, getPostSaleLeads);
postSaleRouter.post("/post-sale-lead-add", authenticateToken, addPostSaleLead);
postSaleRouter.post(
  "/post-sale-lead-update/:id",
  authenticateToken,
  updatePostSaleLeadById
);
postSaleRouter.get(
  "/post-sale-leads-for-pse/:id",
  authenticateToken,
  getPostSaleLeadsForExecutive
);
postSaleRouter.get(
  "/post-sale-lead-by-id/:flatNo",
  authenticateToken,
  getPostSaleLeadById
);

postSaleRouter.get(
  "/post-sale-lead-by-flat",
  authenticateToken,
  getPostSaleLeadByFlat
);

export default postSaleRouter;
