import { Router } from "express";
import {
  deleteClient,
  forgotPasswordClient,
  getClientById,
  getClients,
  updateClient,
  resetPasswordClient,
  registerClient,
  loginClient,
  searchClients,
  loginPhone,
  newPasswordClient,
  generateClientOtp,
} from "../../controller/client.controller.js";
import { authenticateToken } from "../../middleware/auth.middleware.js";
import { validateClientFields } from "../../middleware/client.middleware.js";

const clientRouter = Router();
clientRouter.get("/client", authenticateToken, getClients);
clientRouter.get("/search-client", authenticateToken, searchClients);

clientRouter.get("/client-id/:id", getClientById);
clientRouter.post(
  "/client-register",
  // validateClientFields,
  registerClient
);
clientRouter.post("/client-login", validateClientFields, loginClient);
clientRouter.post("/client-phoneLogin", validateClientFields, loginPhone);

clientRouter.post(
  "/client-edit/:id",
  authenticateToken,
  validateClientFields,
  updateClient
);
clientRouter.post(
  "/client-forgot-password",
  validateClientFields,
  forgotPasswordClient
);

clientRouter.post(
  "/client-reset-password",
  validateClientFields,
  resetPasswordClient
);

clientRouter.post("/client-otp-generate", generateClientOtp);

clientRouter.post("/client-new-password/:id", newPasswordClient);
clientRouter.post("/client-update/:id", authenticateToken, updateClient);
clientRouter.delete("/client/:id", authenticateToken, deleteClient);

export default clientRouter;
