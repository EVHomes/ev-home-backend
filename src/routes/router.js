import { Router } from "express";
import cpRouter from "./channelPartner/channelPartnerRouter.js";
import employeeRouter from "./employee/employeeRouter.js";
import divRouter from "./division/divisionRouter.js";
import desRouter from "./designation/designationRouter.js";
import deptRouter from "./department/departmentRouter.js";
import ourProjectRouter from "./ourProject/ourProjectRouter.js";
import leadRouter from "./lead/leadRouter.js";
import clientRouter from "./client/clientRouter.js";
import siteVisitRouter from "./siteVisit/sitevisitRouter.js";
import storageRouter from "./storage/storageRouter.js";
import { readFile } from "fs/promises";
import oneSignalRouter from "./oneSignal/oneSignalRouter.js";
import blockTokenRouter from "./bockedToken/blockTokenRouter.js";
import { sendEmail } from "../utils/brevo.js";

const router = Router();

router.get("/", async (req, res) => {
  const htmlContent = await readFile("./src/templates/api_welcome_page.html", "utf8");
  return res.type("html").send(htmlContent);
});
router.post("/email", async (req, res, next) => {
  try {
    const resp = await sendEmail(
      "aktarul.evgroup@gmail.com",
      "test email sent for app otp",
      "0000"
    );
    res.send(resp);
  } catch (error) {
    next(error);
  }
});
router.use(cpRouter);
router.use(employeeRouter);
router.use(divRouter);
router.use(desRouter);
router.use(deptRouter);
router.use(ourProjectRouter);
router.use(leadRouter);
router.use(clientRouter);
router.use(storageRouter);
router.use(siteVisitRouter);
router.use(oneSignalRouter);
router.use(blockTokenRouter);
export default router;
