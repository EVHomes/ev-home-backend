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
import { fileURLToPath } from "url";
import fs from "fs";
import csv from "csv-parser";
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


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
ourProjectRouter.post(
  "/our-project-flat-update",
  authenticateToken,
  updateFlatDetails
);

ourProjectRouter.delete("/ourProjects/:id", authenticateToken, deleteProject);
ourProjectRouter.get("/ourProjects-search", authenticateToken, searchProjects);

ourProjectRouter.get("/ourProjects-flatList-csv", async (req, res) => {
  try {
    // Fetch the project and get flatList
    const resp = await ourProjectModel.findById(
      "project-ev-10-marina-bay-vashi-sector-10"
    );
    const flats = resp.flatList;

    // Define headers for the CSV
    const headers = [
      "type",
      "floor",
      "number",
      "flatNo",
      "configuration",
      "carpetArea",
      "sellableCarpetArea",
      "allInclusiveValue",
      "occupied",
      "occupiedBy",
      "msp1",
      "msp2",
      "msp3",
    ];

    // Create a write stream to a CSV file
    const filePath = "./flatList.csv";
    const writeStream = fs.createWriteStream(filePath);

    // Write the headers
    writeStream.write(headers.join(",") + "\n");

    // Write each row of data
    flats.forEach((flat) => {
      const row = headers.map((header) => flat[header] || "").join(",");
      writeStream.write(row + "\n");
    });

    // Close the stream
    writeStream.end();

    // Send the file as a response
    writeStream.on("finish", () => {
      res.download(filePath, "flatList.csv", (err) => {
        if (err) {
          console.error("Error sending file:", err);
          res.status(500).send("Failed to download file.");
        } else {
          console.log("File sent successfully.");
        }

        // Cleanup: Remove the file after sending
        fs.unlinkSync(filePath);
      });
    });
  } catch (error) {
    console.error("Error exporting data:", error);
    res.status(500).send("Error exporting data.");
  }
});

export default ourProjectRouter;
