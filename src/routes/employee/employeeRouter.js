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
import {
  validateEmployeeFields,
  validateRegisterEmployeeFields,
} from "../../middleware/employee.middleware.js";

const employeeRouter = Router();

employeeRouter.get("/employee", getEmployees);

employeeRouter.get("/employee/:id", getEmployeeById);

employeeRouter.post(
  "/employee-register",
  validateEmployeeFields,
  validateRegisterEmployeeFields,
  registerEmployee
);
employeeRouter.post("/employee-login", validateEmployeeFields, loginEmployee);

employeeRouter.post(
  "/employee-edit/:id",
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

employeeRouter.delete("/employee/:id", deleteEmployeeById);

export default employeeRouter;
