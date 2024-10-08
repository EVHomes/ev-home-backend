import { Router } from "express";
import cpRouter from "./channelPartner/channelPartnerRouter.js";
import employeeRouter from "./employee/employeeRouter.js";

const router = Router();
router.use(cpRouter);
router.use(employeeRouter);
export default router;
