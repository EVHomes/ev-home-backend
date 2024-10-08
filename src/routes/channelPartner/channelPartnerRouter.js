import { Router } from "express";
import {
  deleteChannelPartnerById,
  editChannelPartnerById,
  forgotPasswordChannelPartner,
  getChannelPartnerById,
  getChannelPartners,
  loginChannelPartner,
  registerChannelPartner,
  resetPasswordChannelPartner,
} from "../../controller/channelPartner.controller.js";
import { validateChannelPartnerFields } from "../../middleware/channelPartner.middleware.js";

const cpRouter = Router();

cpRouter.get("/channel-partner", getChannelPartners);
cpRouter.get("/channel-partner/:id", getChannelPartnerById);
cpRouter.post(
  "/channel-partner-register",
  validateChannelPartnerFields,
  registerChannelPartner
);
cpRouter.post(
  "/channel-partner-login",
  validateChannelPartnerFields,
  loginChannelPartner
);

cpRouter.post(
  "/channel-partner-edit/:id",
  validateChannelPartnerFields,
  editChannelPartnerById
);

cpRouter.post(
  "/channel-partner-forgot-password",
  validateChannelPartnerFields,
  forgotPasswordChannelPartner
);

cpRouter.post(
  "/channel-partner-reset-password",
  validateChannelPartnerFields,
  resetPasswordChannelPartner
);

cpRouter.delete("/channel-partner/:id", deleteChannelPartnerById);

export default cpRouter;
