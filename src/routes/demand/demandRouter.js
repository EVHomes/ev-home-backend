import { Router } from "express";

import { addDemand, getDemand,getDemandCountByProjectAndSlab, getDemandInfo } from "../../controller/demand.controller.js";

const demandRouter = Router();

demandRouter.get("/demand", getDemand);
demandRouter.post("/add-demand", addDemand);
demandRouter.get("/demand-by-project",getDemandCountByProjectAndSlab);
demandRouter.get("/demand-info",getDemandInfo);


export default demandRouter;
