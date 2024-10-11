import { Router } from "express";

import {
  addBlockToken,
  deleteBLockedToken,
  getBlockedTokens,
  searchBlockedTokens,
} from "../../controller/blockToken.controller.js";

import { authenticateToken } from "../../middleware/auth.middleware.js";

const blockTokenRouter = Router();

blockTokenRouter.get("/blocked-tokens", authenticateToken, getBlockedTokens);

blockTokenRouter.get(
  "/search-blocked-token",
  authenticateToken,
  searchBlockedTokens
);

blockTokenRouter.post("/blocked-token-add", authenticateToken, addBlockToken);

blockTokenRouter.delete(
  "/blocked-token/:token",
  authenticateToken,
  deleteBLockedToken
);

export default blockTokenRouter;
