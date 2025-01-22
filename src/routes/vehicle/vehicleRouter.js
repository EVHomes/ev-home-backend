import { Router } from "express";
import { addVehicle, getVehicle } from "../../controller/vehicle.controller.js";
const vehicleRouter = Router();

vehicleRouter.get("/vehicle",getVehicle);
vehicleRouter.post("/vehicle-add",addVehicle);

export default vehicleRouter;