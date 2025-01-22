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
import reqRouter from "./requirement/reqRouter.js";
import { encryptPassword } from "../utils/helper.js";
import postSaleRouter from "./postSaleLead/postSaleLeadRouter.js";
import contestRouter from "./contest/contestRouter.js";
import paymentRouter from "./payment/paymentRouter.js";
import demandRouter from "./demand/demandRouter.js";
import meetingRouter from "./meetingSummary/meetingSummaryRouter.js";
import targetRouter from "./target/targetRouter.js";
import teamSectionRouter from "./teamSection/teamSectionRouter.js";
import taskRouter from "./task/taskRouter.js";
import notifyRouter from "./notification/notificationRouter.js";
import attendanceRouter from "./attendance/attendanceRouter.js";
import chatRouter from "./chat/chatRouter.js";
import upcomingRouter from "./upcomingprojects/upcomingprojectsRouter.js";

import enquiryformRouter from "./enquiryform/enquiryformRouter.js";

import whatsnewrouterRouter from "./whatsnew/whatsnewRouter.js";
import appUpdateRouter from "./appUpdate/appUpdateRouter.js";
import auditSectionRouter from "./auditSection/auditSectionRouter.js";
import shiftRouter from "./shift/shiftRouter.js";
import weekoffRouter from "./weekoff/weekoffRouter.js";
import faceIdRouter from "./faceId/faceIdRouter.js";
import geoRouter from "./geofence/geofenceRouter.js";
import feedbackEnquiryRouter from "./feedbackEnquiry/feedbackEnquiryRouter.js"
import eventRouter from "./event/eventRouter.js";
import testimonialRouter from "./testimonial/testimonialRouter.js";
import vehicleRouter from "./vehicle/vehicleRouter.js";

const router = Router();
router.get("/ping", async (req, res) => {
  res.json({ code: 200, message: "ok" });
});

router.get("/", async (req, res) => {
  const htmlContent = await readFile(
    "./src/templates/api_welcome_page.html",
    "utf8"
  );
  return res.type("html").send(htmlContent);
});
// router.post("/email", async (req, res, next) => {
//   try {
//     const resp = await sendEmail(
//       "aktarul.evgroup@gmail.com",
//       "test email sent for app otp",
//       "0000"
//     );
//     res.send(resp);
//   } catch (error) {
//     next(error);
//   }
// });
router.post("/hashPassword", async (req, res, next) => {
  const { password } = req.body;
  try {
    const resp = await encryptPassword(password);
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
router.use(reqRouter);
router.use(postSaleRouter);
router.use(contestRouter);
router.use(paymentRouter);
router.use(demandRouter);
router.use(meetingRouter);
router.use(targetRouter);
router.use(teamSectionRouter);
router.use(taskRouter);
router.use(notifyRouter);
router.use(attendanceRouter);
router.use(chatRouter);
router.use(upcomingRouter);
router.use(enquiryformRouter);
router.use(whatsnewrouterRouter);
router.use(appUpdateRouter);
router.use(auditSectionRouter);
router.use(shiftRouter);
router.use(weekoffRouter);
router.use(faceIdRouter);
router.use(geoRouter);
router.use(feedbackEnquiryRouter);
router.use(eventRouter);
router.use(testimonialRouter);
router.use(vehicleRouter);

export default router;
