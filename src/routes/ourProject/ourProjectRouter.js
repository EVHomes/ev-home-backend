import { Router } from "express";
import {
  addProjects,
  getOurProjects,
  getProjectsById,
  updateProjects,
  deleteProject,
  searchProjects,
  updateFlatDetails,
} from "../../controller/ourProjects.controller.js";
import { authenticateToken } from "../../middleware/auth.middleware.js";
import ourProjectModel from "../../model/ourProjects.model.js";

const ourProjectRouter = Router();
ourProjectRouter.get("/ourProjects", authenticateToken, getOurProjects);

ourProjectRouter.get("/ourProjects:/id", authenticateToken, getProjectsById);
ourProjectRouter.post(
  "/ourProjects-add",
  //  authenticateToken,
  addProjects
);
ourProjectRouter.post(
  "/ourProjects-update/:id",
  authenticateToken,
  updateProjects
);
ourProjectRouter.post(
  "/our-project-flat-update",
  authenticateToken,
  updateFlatDetails
);

ourProjectRouter.delete("/ourProjects/:id", authenticateToken, deleteProject);
ourProjectRouter.get("/ourProjects-search", authenticateToken, searchProjects);

ourProjectRouter.get("/ourProjects-flatList", async (req, res) => {
  try {
    const resp = await ourProjectModel.findById(
      "project-ev-9-square-vashi-sector-9"
    );
    const flats = resp.flatList.map((flat) => {
      if (flat.number === 2) {
        flat.occupied = true;
      }
      return flat;
    });
    resp.flatList = flats;
    await resp.save();
    // const resp = await ourProjectModel.updateOne(
    //   { _id: "project-ev-9-square-vashi-sector-9" }, // Find the project by its ID
    //   {
    //     $set: { "project.flatList.$[elem].occupied": true }, // Update the `occupied` field
    //   },
    //   {
    //     arrayFilters: [{ "elem.flatNo": { $in: occupiedFlats } }], // Filter array elements matching `flatNo`
    //     multi: true, // Allow multiple updates in the array
    //   }
    // );
    res.send(flats);
  } catch (error) {
    res.send(error);
  }
});

export default ourProjectRouter;
