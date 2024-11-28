import { Router } from "express";
import { getTeamSections } from "../../controller/teamSection.controller.js";
const teamSectionRouter = Router();

teamSectionRouter.get("/team-sections", getTeamSections);
// teamSectionRouter.post("/requirement-add", addRequirement);

export default teamSectionRouter;
