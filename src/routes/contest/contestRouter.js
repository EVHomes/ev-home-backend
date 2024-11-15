import { Router } from "express";
import {
  addContest
} from "../../controller/contest.controller.js";
import { validateContestFields } from "../../middleware/contest.middleware.js";

validateContestFields

const contestRouter = Router();
contestRouter.post(
  "/add-contest",
validateContestFields,
  // authenticateToken,
  addContest
);

export default contestRouter;