import { addMeetingSummary, getMeetingSummary } from "../../controller/meetingSummary.controller.js";
import { successRes } from "../../model/response.js";
import { Router } from "express";

const meetingRouter=Router();
meetingRouter.get("/meeting",getMeetingSummary);
meetingRouter.post("/meeting-add",addMeetingSummary);

export default meetingRouter;
