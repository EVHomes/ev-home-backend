import { Router } from "express";
import { addNewTarget } from "../../controller/target.controller.js";
const targetRouter = Router();

targetRouter.post("/add-target", addNewTarget);

export default targetRouter;
