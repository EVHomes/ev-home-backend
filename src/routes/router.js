import { Router } from "express";
import cpRouter from "./channelPartner/channelPartnerRouter.js";
import employeeRouter from "./employee/employeeRouter.js";
import divRouter from "./division/divisionRouter.js";
import desRouter from "./designation/designationRouter.js";
import deptRouter from "./department/departmentRouter.js";

const router = Router();
router.use(cpRouter);
router.use(employeeRouter);
router.use(divRouter);
router.use(desRouter);
router.use(deptRouter);
export default router;
