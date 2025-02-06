import { Router } from "express";
import {
  getLeave,
  addLeave,
  updateLeaveStatus,
  getMyLeave,
  getApplyLeave,
} from "../../controller/leaveRequest.controller.js";
import { authenticateToken } from "../../middleware/auth.middleware.js";
const leaveRequestRouter = Router();

leaveRequestRouter.get("/get-my-leave/:id", getMyLeave);
leaveRequestRouter.get("/get-leave", getLeave);
leaveRequestRouter.get("/get-reporting-leave/:id", getApplyLeave);
leaveRequestRouter.post("/add-leave", authenticateToken, addLeave);
leaveRequestRouter.post(
  "/update-leave/:id",
  authenticateToken,
  updateLeaveStatus
);

export default leaveRequestRouter;
