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
import ourProjectModel from "../../model/ourProjects.model.js";

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
ourProjectRouter.get("/ourProjects-flatList", async (req, res) => {
  try {
    const occupiedFlats = [
      "1001",
      "1101",
      "1201",
      "1301",
      "1401",
      "1501",
      "1503",
      "1505",
      "1506",
      "1601",
      "1701",
      "1801",
      "1806",
      "1901",
      "1902",
      "1903",
      "1905",
      "2003",
      "2006",
    ];

    const resp = await ourProjectModel.updateOne(
      { _id: "project-ev-9-square-vashi-sector-9" }, // Find the project by its ID
      {
        $set: { "project.flatList.$[elem].occupied": true }, // Update the `occupied` field
      },
      {
        arrayFilters: [{ "elem.flatNo": { $in: occupiedFlats } }], // Filter array elements matching `flatNo`
        multi: true, // Allow multiple updates in the array
      }
    );
    res.send(resp);
  } catch (error) {
    res.send(error);
  }
});

export default ourProjectRouter;
