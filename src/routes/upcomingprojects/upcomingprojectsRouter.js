import { Router } from "express";
import {
  addupcomingProjects,
  getupcomingProjects,
  updateupcomingProjects,
  
} from "../../controller/upcoming_projects.controller.js";

const upcomingRouter = Router();
upcomingRouter.get("/upcomingProjects",  getupcomingProjects);

upcomingRouter.post(
  "/upcomingProjects-add",
  //  authenticateToken,
  addupcomingProjects,
);
upcomingRouter.post(
  "/upcomingProjects-update/:id",
  // authenticateToken,
  updateupcomingProjects,
);

export default upcomingRouter;
