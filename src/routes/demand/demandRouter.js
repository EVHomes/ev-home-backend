import { Router } from "express";

import { addDemand, getDemand } from "../../controller/demand.controller.js";

const demandRouter = Router();

demandRouter.get("/demand", getDemand);
demandRouter.post("/add-demand", addDemand);
export default demandRouter;
