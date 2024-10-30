import { Router } from "express";
import {
  addPostSaleLead,
  getPostSaleLeads,
  updatePostSaleLeadById,
} from "../../controller/postSaleLead.controller.js";

const postSaleRouter = Router();
postSaleRouter.get("/post-sale-leads", getPostSaleLeads);
postSaleRouter.post("/post-sale-lead-add", addPostSaleLead);
postSaleRouter.post("/post-sale-lead-update/:id", updatePostSaleLeadById);

export default postSaleRouter;
