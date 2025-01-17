import { Router } from "express";
import { addEvent, deleteEvent, getEvent, getEventById, updateEvent } from "../../controller/event.controller.js";

const eventRouter = Router();
eventRouter.get("/event",getEvent);

eventRouter.post("/event-add",addEvent);
eventRouter.get("/event-id/:id",getEventById);
eventRouter.post("/update-event-id/:id",updateEvent);
eventRouter.delete("/event-delete/:id",deleteEvent);


export default eventRouter;