import { Router } from "express";
import { authenticateToken } from "../../middleware/auth.middleware.js";
import {
  addweekoff,
  getMyWeekOffs,
  getReportingToWeekOffs,
  getWeekOffById,
  getWeekOffs,
  updateWeekOffStatus,
} from "../../controller/weekoff.controller.js";
import { getWeek } from "date-fns";
const weekoffRouter = Router();
// weekoffRouter.get("/weekoff",getweekoff);
weekoffRouter.post("/add-weekoff", addweekoff);
weekoffRouter.get("/get-weekoff", getWeekOffs);
weekoffRouter.get("/get-my-weekoff/:id", getMyWeekOffs);
weekoffRouter.get("/get-reporting-weekoff/:id", getReportingToWeekOffs);
weekoffRouter.get("/get-weekoff/:id", getWeekOffById);
weekoffRouter.post("/weekoff/:id", updateWeekOffStatus);
export default weekoffRouter;
