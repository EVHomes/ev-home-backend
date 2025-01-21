import {
  addMeetingSummary,
  getMeetingSummary,
  getClientMeetingById,
  scheduleMeetingByClient,
} from "../../controller/meetingSummary.controller.js";
import { successRes } from "../../model/response.js";
import { Router } from "express";

const meetingRouter = Router();
meetingRouter.get("/meeting", getMeetingSummary);
meetingRouter.post("/meeting-add", addMeetingSummary);
meetingRouter.post("/meeting-add-by-client/:id", scheduleMeetingByClient);
meetingRouter.get("/meeting-client-id/:id", getClientMeetingById);

export default meetingRouter;
