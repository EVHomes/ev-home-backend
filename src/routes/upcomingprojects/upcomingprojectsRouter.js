import { Router } from "express";
import {
  addupcomingProjects,
  getupcomingProjects,
  
} from "../../controller/upcoming_projects.controller.js";

const upcomingRouter = Router();
upcomingRouter.get("/upcomingProjects",  getupcomingProjects);

upcomingRouter.post(
  "/upcomingProjects-add",
  //  authenticateToken,
  addupcomingProjects,
);


export default upcomingRouter;
