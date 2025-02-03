import { Router } from "express";
import { authenticateToken } from "../../middleware/auth.middleware.js";
import {
  addShift,
  getShiftById,
  getShifts,
  deleteShiftById,
  editShift,
  assignShift,
  getAssignedEmployees,
  addEmployeesToShift,
  removeEmployeeFromShift,
} from "../../controller/shift.controller.js";
const shiftRouter = Router();

shiftRouter.get("/shifts", getShifts);
shiftRouter.post("/add-shift", addShift);
shiftRouter.get("/shift/:id", getShiftById);
shiftRouter.delete("/shift/:id", deleteShiftById);
shiftRouter.post("/shift-update/:id", editShift);
shiftRouter.post("/assign-employees-to-shift", assignShift);

shiftRouter.get("/shift/:shiftId/employees", getAssignedEmployees);
shiftRouter.post("/shift/:shiftId/add-employees", addEmployeesToShift);
shiftRouter.delete(
  "/shift/:shiftId/remove-employee/:employeeId",
  removeEmployeeFromShift
);

export default shiftRouter;
