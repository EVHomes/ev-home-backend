import { Router } from "express";
import { addWhatsNew, getWhatsNew, updateWhatsNew,deleteWhatsNew } from "../../controller/whatsnew.controller.js";

const whatsnewrouterRouter = Router();

whatsnewrouterRouter.get("/whatsnew",getWhatsNew);
whatsnewrouterRouter.post("/whats-new-add",addWhatsNew);
whatsnewrouterRouter.post("/whatsnew-update/:id",updateWhatsNew);
whatsnewrouterRouter.delete("/whatsnew-delete/:id",deleteWhatsNew);

export default whatsnewrouterRouter;