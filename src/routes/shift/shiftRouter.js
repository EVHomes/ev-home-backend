import { Router } from "express";
import { authenticateToken } from "../../middleware/auth.middleware.js";
import {
  addShift,
  getShiftById,
  getShifts,
} from "../../controller/shift.controller.js";
const shiftRouter = Router();

shiftRouter.get("/shifts", getShifts);
shiftRouter.post("/add-shift", addShift);
shiftRouter.get("/shift/:id", getShiftById);

export default shiftRouter;
