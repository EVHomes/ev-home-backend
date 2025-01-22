import { Router } from "express";
import {
  addChatOptions,
  getDefaultOptionChatOptions,
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

export default chatRespRouter;
