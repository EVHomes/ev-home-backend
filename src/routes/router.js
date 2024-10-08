import { Router } from "express";
import cpRouter from "./channelPartner/channelPartnerRouter.js";
import desRouter from "./designation/designationRouter.js";
import deptRouter from "./department/departmentRouter.js";
import divRouter from "./division/divisionRouter.js";

const router = Router();
router.use(cpRouter);
router.use(desRouter);
router.use(deptRouter);
router.use(divRouter);

export default router;
