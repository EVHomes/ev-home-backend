import { Router } from "express";
import {
  getGeofence,
  // getGeofenceById,
  addGeofence,
  deleteGeofence,
} from "../../controller/geofence.controller.js";
import { authenticateToken } from "../../middleware/auth.middleware.js";

const geoRouter = Router();
geoRouter.get(
  "/geofence",
  // authenticateToken,
  getGeofence
);
// geoRouter.get(
//   "/geofence/:id",
//   // authenticateToken,
//   getGeofenceById
// );
geoRouter.post(
  "/geofence-add",
  // authenticateToken,
  addGeofence
);

geoRouter.delete("/upcomingProjects/:id", deleteGeofence);


export default geoRouter;
