import { Router } from "express";
import { authenticateToken } from "../../middleware/auth.middleware.js";
import { addweekoff, getWeekOffById, getWeekOffs } from "../../controller/weekoff.controller.js";
import { getWeek } from "date-fns";
const weekoffRouter =Router();
// weekoffRouter.get("/weekoff",getweekoff);
weekoffRouter.post("/add-weekoff",addweekoff);
weekoffRouter.get("/get-weekoff",getWeekOffs);
weekoffRouter.get("/get-weekoff/:id", getWeekOffById);
export default weekoffRouter