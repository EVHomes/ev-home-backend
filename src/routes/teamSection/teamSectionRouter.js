import { Router } from "express";
import {
  addTeamSection,
  getTeamSectionById,
  getTeamSections,
} from "../../controller/teamSection.controller.js";
const teamSectionRouter = Router();

teamSectionRouter.get("/team-sections", getTeamSections);
teamSectionRouter.get("/team-section-by-id/:id", getTeamSectionById);
teamSectionRouter.post("/team-section-add", addTeamSection);

export default teamSectionRouter;
