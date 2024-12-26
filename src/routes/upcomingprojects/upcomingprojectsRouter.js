import { Router } from "express";
import {
  addupcomingProjects,
  getupcomingProjects,
  updateupcomingProjects,
  deleteupcomingProject,
  
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

upcomingRouter.delete("/upcomingProjects/:id", deleteupcomingProject);

export default upcomingRouter;
