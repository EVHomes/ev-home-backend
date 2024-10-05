import { Router } from "express";
import {
  getChannelPartnerById,
  getChannelPartners,
} from "../../controller/channelPartner.controller.js";

const cpRouter = Router();
cpRouter.get("/channel-partner", getChannelPartners);
cpRouter.get("/channel-partner/:id", getChannelPartnerById);
export default cpRouter;
