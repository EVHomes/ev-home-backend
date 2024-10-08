import { Router } from "express";
import { 
 addProjects, 
 getOurProjects,
 getProjectsById,
 updateProjects,
 deleteProject,
} from "../../controller/ourProjects.controller.js";

const ourProjectRouter=Router();
ourProjectRouter.get("/ourProjects",getOurProjects);
ourProjectRouter.get("/ourProjects:/id",getProjectsById);
ourProjectRouter.post("/ourProjects-add",addProjects);
ourProjectRouter.post("/ourProjects-update/:id",updateProjects);
ourProjectRouter.delete("/ourProjects/:id",deleteProject);

export default ourProjectRouter;



