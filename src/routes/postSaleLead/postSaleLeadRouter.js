import { Router } from "express";
import { getPostSaleLeads } from "../../controller/postSaleLead.controller.js";

const postSaleRouter = Router();
postSaleRouter.get("/post-sale-leads", getPostSaleLeads);

export default postSaleRouter;
