import { Router } from "express";
import { getDesignation } from "../../controller/designation.controller.js";

const desRouter = Router();
cpRouter.get("/channel-partner", getDesignation);
export default desRouter;
