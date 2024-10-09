import { Router } from "express";
import {
  getDesignation,
  getDesignationById,
  addDesignation,
  updateDesignation,
  deleteDesignation,
} from "../../controller/designation.controller.js";

const desRouter = Router();
desRouter.get("/designation", getDesignation);
desRouter.get("/designation/:id", getDesignationById);
desRouter.post("/designation-add", addDesignation);
desRouter.post("/designation-update/:id", updateDesignation);
desRouter.delete("/designation/:id", deleteDesignation);

export default desRouter;
