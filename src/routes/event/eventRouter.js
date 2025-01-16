import { Router } from "express";
import { addEvent, getEvent, getEventById } from "../../controller/event.controller.js";

const eventRouter = Router();
eventRouter.get("/event",getEvent);

eventRouter.post("/event-add",addEvent);
eventRouter.get("/event-id/:id",getEventById);

export default eventRouter;