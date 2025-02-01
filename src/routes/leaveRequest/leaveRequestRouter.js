import { Router } from "express";
import {
  getLeave,
  addLeave,
  updateLeaveStatus,
  getMyLeave,
  getApplyLeave,
} from "../../controller/leaveRequest.controller.js";
const leaveRequestRouter = Router();

leaveRequestRouter.get("/get-my-leave/:id", getMyLeave);
leaveRequestRouter.get("/get-leave", getLeave);
leaveRequestRouter.get("/get-reporting-leave/:id", getApplyLeave);
leaveRequestRouter.post("/add-leave", addLeave);
leaveRequestRouter.post("/update-leave/:id", updateLeaveStatus);

export default leaveRequestRouter;
