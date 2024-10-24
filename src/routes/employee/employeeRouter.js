import { Router } from "express";
import {
  deleteEmployeeById,
  editEmployeeById,
  forgotPasswordEmployee,
  getClosingManagers,
  getEmployeeById,
  getEmployees,
  getTeamLeaders,
  loginEmployee,
  registerEmployee,
  resetPasswordEmployee,
  searchEmployee,
} from "../../controller/employee.controller.js";
import { validateEmployeeFields } from "../../middleware/employee.middleware.js";
import { authenticateToken } from "../../middleware/auth.middleware.js";

const employeeRouter = Router();

employeeRouter.get(
  "/employee",
  // authenticateToken,
  getEmployees
);

employeeRouter.get("/employee/:id", authenticateToken, getEmployeeById);

employeeRouter.get(
  "/employee-closing-manager",
  // authenticateToken,
  getClosingManagers
);

employeeRouter.get(
  "/employee-team-leader",
  // authenticateToken,
  getTeamLeaders
);

employeeRouter.post(
  "/employee-register",
  validateEmployeeFields,
  registerEmployee
);
employeeRouter.post("/employee-login", validateEmployeeFields, loginEmployee);

employeeRouter.post(
  "/employee-edit/:id",
  // authenticateToken,
  validateEmployeeFields,
  editEmployeeById
);

employeeRouter.post(
  "/employee-forgot-password",
  validateEmployeeFields,
  forgotPasswordEmployee
);

employeeRouter.post(
  "/employee-reset-password",
  validateEmployeeFields,
  resetPasswordEmployee
);

employeeRouter.delete("/employee/:id", authenticateToken, deleteEmployeeById);

employeeRouter.get("/search-employee", searchEmployee);

export default employeeRouter;
