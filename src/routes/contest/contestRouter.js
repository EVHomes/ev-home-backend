import { Router } from "express";
import {
  addContest,
 
  getContest
} from "../../controller/contest.controller.js";
import { validateContestFields } from "../../middleware/contest.middleware.js";



const contestRouter = Router();
contestRouter.get("/contest",getContest);
contestRouter.post(
  "/add-contest",
  // authenticateToken,
  addContest
);

// contest.post(
//   "/contest-otp",
//   // authenticateToken,
//   generateContestOtp
// );
export default contestRouter;