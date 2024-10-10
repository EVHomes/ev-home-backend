import { Router } from "express";
import {
  deleteEmployeeById,
  editEmployeeById,
  forgotPasswordEmployee,
  getEmployeeById,
  getEmployees,
  loginEmployee,
  registerEmployee,
  resetPasswordEmployee,
} from "../../controller/employee.controller.js";
import { validateEmployeeFields } from "../../middleware/employee.middleware.js";
import { authenticateToken } from "../../middleware/auth.middleware.js";

const employeeRouter = Router();

employeeRouter.get("/employee", authenticateToken, getEmployees);

employeeRouter.get("/employee/:id", authenticateToken, getEmployeeById);

employeeRouter.post(
  "/employee-register",
  validateEmployeeFields,
  registerEmployee
);
employeeRouter.post("/employee-login", validateEmployeeFields, loginEmployee);

employeeRouter.post(
  "/employee-edit/:id",
  authenticateToken,
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

export default employeeRouter;
