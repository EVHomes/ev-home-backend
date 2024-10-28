import { Router } from "express";
import {
  addPostSaleLead,
  getPostSaleLeads,
} from "../../controller/postSaleLead.controller.js";

const postSaleRouter = Router();
postSaleRouter.get("/post-sale-leads", getPostSaleLeads);
postSaleRouter.get("/post-sale-lead-add", addPostSaleLead);

export default postSaleRouter;
