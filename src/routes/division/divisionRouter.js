import { Router } from "express";
import {
  getDivision,
  getDivisionById,
  addDivision,
  updateDivision,
  deleteDivision,
} from "../../controller/division.controller.js";

const divRouter = Router();
divRouter.get("/division", getDivision);
divRouter.get("/division/:id", getDivisionById);
divRouter.post("/division-add", addDivision);
divRouter.post("/division-update/:id", updateDivision);
divRouter.delete("/division/:id", deleteDivision);


export default divRouter;
