import { Router } from "express";
import { addNewTarget, getMyTarget } from "../../controller/target.controller.js";
import { authenticateToken } from "../../middleware/auth.middleware.js";

const targetRouter = Router();

targetRouter.get("/get-target/:id", authenticateToken, getMyTarget);
targetRouter.post("/add-target", authenticateToken, addNewTarget);

export default targetRouter;
