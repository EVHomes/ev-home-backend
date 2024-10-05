import { Router } from "express";
import { getChannelPartners } from "../../controller/channelPartner.controller.js";

const cpRouter = Router();
cpRouter.get("/channel-partner", getChannelPartners);
export default cpRouter;
