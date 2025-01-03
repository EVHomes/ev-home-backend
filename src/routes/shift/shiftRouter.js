import { Router } from "express";
import { authenticateToken } from "../../middleware/auth.middleware.js";
import { getShifts } from "../../controller/shift.controller.js";
const shiftRouter = Router();

shiftRouter.get("/shifts", getShifts);
// shiftRouter.post("/assign-task/:id", authenticateToken, assignTask);
// shiftRouter.post("/update-task/:id", authenticateToken, updateTask);
// shiftRouter.post("/update-feedback", authenticateToken, updateFeedback);

export default shiftRouter;
