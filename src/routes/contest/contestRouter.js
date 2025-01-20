import { Router } from "express";
import {
  addContest,
  getContest,
  getContestById,
  updateContestById,
} from "../../controller/contest.controller.js";

const contestRouter = Router();
contestRouter.get("/contest", getContest);

contestRouter.post("/contest-update/:id", updateContestById);

contestRouter.post(
  "/add-contest",
  // authenticateToken,
  addContest
);
contestRouter.post("/contest-byPhone", getContestById);

contestRouter.get("/contest-id/:id", getContestById);
// contest.post(
//   "/contest-otp",
//   // authenticateToken,
//   generateContestOtp
// );
export default contestRouter;
