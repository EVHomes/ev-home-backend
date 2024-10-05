import { Router } from "express";
import cpRouter from "./channelPartner/channelPartnerRouter.js";

const router = Router();
router.use(cpRouter);
export default router;
