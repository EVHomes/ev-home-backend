import { Router } from "express";
import { addWhatsNew, getWhatsNew } from "../../controller/whatsnew.controller.js";

const whatsnewrouterRouter = Router();

whatsnewrouterRouter.get("/whatsnew",getWhatsNew);
whatsnewrouterRouter.post("/whats-new-add",addWhatsNew);

export default whatsnewrouterRouter;