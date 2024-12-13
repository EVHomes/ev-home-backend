import { addMeetingSummary, getMeetingSummary,getClientMeetingById } from "../../controller/meetingSummary.controller.js";
import { successRes } from "../../model/response.js";
import { Router } from "express";

const meetingRouter=Router();
meetingRouter.get("/meeting",getMeetingSummary);
meetingRouter.post("/meeting-add",addMeetingSummary);
meetingRouter.get("/meeting-client-id/:id",getClientMeetingById);

export default meetingRouter;
