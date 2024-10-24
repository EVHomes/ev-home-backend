import { Router } from "express";
import {
  addRequirement,
  getRequirements,
} from "../../controller/requirement.controller.js";
const reqRouter = Router();

reqRouter.get("/requirements", getRequirements);
reqRouter.post("/requirement-add", addRequirement);

export default reqRouter;
