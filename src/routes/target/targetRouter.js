import { Router } from "express";
import {
  addNewTarget,
  getCarryForwardOption,
  getMyTarget,
} from "../../controller/target.controller.js";
import { authenticateToken } from "../../middleware/auth.middleware.js";

const targetRouter = Router();

targetRouter.get("/get-target/:id", authenticateToken, getMyTarget);
targetRouter.get("/get-carry-forward-opt/:id", getCarryForwardOption);
targetRouter.post("/add-target", authenticateToken, addNewTarget);

export default targetRouter;
