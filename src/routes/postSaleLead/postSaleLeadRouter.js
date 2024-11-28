import { Router } from "express";
import {
  addPostSaleLead,
  getPostSaleLeadById,
  getPostSaleLeads,
  getPostSaleLeadsForExecutive,
  updatePostSaleLeadById,
} from "../../controller/postSaleLead.controller.js";

const postSaleRouter = Router();
postSaleRouter.get("/post-sale-leads", getPostSaleLeads);
postSaleRouter.post("/post-sale-lead-add", addPostSaleLead);
postSaleRouter.post("/post-sale-lead-update/:id", updatePostSaleLeadById);
postSaleRouter.get(
  "/post-sale-leads-for-pse/:id",
  getPostSaleLeadsForExecutive
);
postSaleRouter.get("/post-sale-lead-by-id/:flatNo", getPostSaleLeadById);

export default postSaleRouter;
