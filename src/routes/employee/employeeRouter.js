import { Router } from "express";
import {
  deleteEmployeeById,
  editEmployeeById,
  forgotPasswordEmployee,
  getClosingManagers,
  getEmployeeByDesignation,
  getEmployeeById,
  getEmployees,
  getPostSaleExecutives,
  getPreSalesExecutive,
  getTeamLeaders,
  loginEmployee,
  registerEmployee,
  resetPasswordEmployee,
  searchEmployee,
  updateDesgEmp,
} from "../../controller/employee.controller.js";
import { validateEmployeeFields } from "../../middleware/employee.middleware.js";
import { authenticateToken } from "../../middleware/auth.middleware.js";

const employeeRouter = Router();

employeeRouter.get(
  "/employee",
  // authenticateToken,
  getEmployees
);
// employeeRouter.get(
//   "/up-desg",
//   // authenticateToken,
//   updateDesgEmp
// );

employeeRouter.get("/employee/:id", authenticateToken, getEmployeeById);

employeeRouter.get("/employee-closing-manager", authenticateToken, getClosingManagers);

employeeRouter.get(
  "/employee-post-sales-executive",
  authenticateToken,
  getPostSaleExecutives
);

employeeRouter.get(
  "/employee-by-designation/:id",
  authenticateToken,
  getEmployeeByDesignation
);

employeeRouter.get("/employee-team-leader", authenticateToken, getTeamLeaders);
employeeRouter.get("/employee-data-analzer", authenticateToken, getTeamLeaders);

employeeRouter.get(
  "/employee-pre-sale-executive",
  authenticateToken,
  getPreSalesExecutive
);

employeeRouter.post("/employee-register", validateEmployeeFields, registerEmployee);
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

// Route to serve the password reset page
employeeRouter.get("/reset-password", (req, res) => {
  res.render("reset-password", { pageTitle: "Reset Your Password" });
});

export default employeeRouter;
