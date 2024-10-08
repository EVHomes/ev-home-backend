import { Router } from "express";
import {
  getDivision,
  getDivisionById,
  addDivision,
} from "../../controller/division.controller.js";

const divRouter = Router();
divRouter.get("/division", getDivision);
divRouter.get("/division/:id", getDivisionById);
divRouter.post("/division-add", addDivision);
export default divRouter;
