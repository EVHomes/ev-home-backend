import { Router } from "express";
import {
  addPostSaleLead,
  getPostSaleLeadById,
  getPostSaleLeads,
  getPostSaleLeadsForExecutive,
  updatePostSaleLeadById,
  getPostSaleLeadByFlat,
  getLeadCounts,
} from "../../controller/postSaleLead.controller.js";
import { authenticateToken } from "../../middleware/auth.middleware.js";

const postSaleRouter = Router();
postSaleRouter.get("/post-sale-leads", getPostSaleLeads);
postSaleRouter.post("/post-sale-lead-add", addPostSaleLead);
postSaleRouter.post("/post-sale-lead-update/:id", updatePostSaleLeadById);
postSaleRouter.get(
  "/post-sale-leads-for-pse/:id",
  getPostSaleLeadsForExecutive
);
postSaleRouter.get("/post-sale-lead-by-id/:flatNo", getPostSaleLeadById);
postSaleRouter.get("/post-sale-leadCount", getLeadCounts);

postSaleRouter.get("/post-sale-lead-by-flat", getPostSaleLeadByFlat);

export default postSaleRouter;
