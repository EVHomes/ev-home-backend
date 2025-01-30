import {Router} from "express";
import{
    getLeave,
    addLeave,
    updateLeaveStatus,
}from "../../controller/leaveRequest.controller.js";
const leaveRequestRouter = Router();

leaveRequestRouter.get("/get-leave",getLeave);
leaveRequestRouter.post("/add-leave",addLeave);
leaveRequestRouter.put("/update-leave/:id",updateLeaveStatus);

export default leaveRequestRouter;
