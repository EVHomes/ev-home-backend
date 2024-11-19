import { Router } from "express";

import {
    getDemand
  } from "../../controller/demand.controller.js";


const demandRouter= Router();

demandRouter.get("/demand",getDemand );
export default demandRouter;
