import { Router } from "express";
import {
  addPostSaleLead,
  getPostSaleLeadCounts,
  getPostSaleLeads,
  updatePostSaleLeadById,
} from "../../controller/postSaleLead.controller.js";

const postSaleRouter = Router();
postSaleRouter.get("/post-sale-leads", getPostSaleLeads);
postSaleRouter.get("/post-sale-lead-count", getPostSaleLeadCounts);
postSaleRouter.post("/post-sale-lead-add", addPostSaleLead);
postSaleRouter.post("/post-sale-lead-update/:id", updatePostSaleLeadById);

export default postSaleRouter;
