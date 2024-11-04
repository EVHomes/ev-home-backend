import { Router } from "express";
import {
  addProjects,
  getOurProjects,
  getProjectsById,
  updateProjects,
  deleteProject,
  searchProjects,
} from "../../controller/ourProjects.controller.js";
import { authenticateToken } from "../../middleware/auth.middleware.js";

const ourProjectRouter = Router();
ourProjectRouter.get(
  "/ourProjects",
  // authenticateToken,
  getOurProjects
);

ourProjectRouter.get("/ourProjects:/id", authenticateToken, getProjectsById);
ourProjectRouter.post(
  "/ourProjects-add",
  //  authenticateToken,
  addProjects
);
ourProjectRouter.post(
  "/ourProjects-update/:id",
  // authenticateToken,
  updateProjects
);
ourProjectRouter.delete("/ourProjects/:id", authenticateToken, deleteProject);
ourProjectRouter.get("/ourProjects-search", authenticateToken, searchProjects);

export default ourProjectRouter;
