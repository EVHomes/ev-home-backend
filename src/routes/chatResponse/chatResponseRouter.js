import { Router } from "express";
import {
  addChatOptions,
  getDefaultOptionChatOptions,
  getDetails
} from "../../controller/chatResponse.controller.js";
const chatRespRouter = Router();
chatRespRouter.post(
  "/add-chat-options",
  // authenticateToken,
  addChatOptions
);

chatRespRouter.get(
  "/get-default-options",
  // authenticateToken,
  getDefaultOptionChatOptions
);

chatRespRouter.get("/get-project-details",getDetails);

export default chatRespRouter;
