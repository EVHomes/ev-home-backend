import { Router } from "express";
import {
  addSiteVisits,
  deleteSiteVisits,
  generateSiteVisitOtp,
  getSiteVisits,
  getSiteVisitsById,
  searchSiteVisits,
  updateSiteVisits,
  verifySiteVisitOtp,
} from "../../controller/siteVisit.controller.js";
import { authenticateToken } from "../../middleware/auth.middleware.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import csv from "csv-parser";
import employeeModel from "../../model/employee.model.js";
import siteVisitModel from "../../model/siteVisitForm.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const siteVisitRouter = Router();
siteVisitRouter.get(
  "/siteVisit",

  // authenticateToken,
  getSiteVisits
);
siteVisitRouter.get("/siteVisit/:id", authenticateToken, getSiteVisitsById);
siteVisitRouter.post(
  "/siteVisits-add",
  // authenticateToken,
  addSiteVisits
);
siteVisitRouter.post(
  "/site-visit-generate-otp",
  // authenticateToken,
  generateSiteVisitOtp
);
siteVisitRouter.post(
  "/site-visit-otp-verify",
  // authenticateToken,
  verifySiteVisitOtp
);

siteVisitRouter.post("/siteVisit-update/:id", authenticateToken, updateSiteVisits);
siteVisitRouter.delete("/siteVisit/:id", authenticateToken, deleteSiteVisits);
siteVisitRouter.get("/siteVisits-search", searchSiteVisits);

siteVisitRouter.post("/update-staff-from-csv", async (req, res) => {
  const results = [];
  const data = [];
  const errors = [];
  console.log(__dirname);
  const csvFilePath = path.join(__dirname, "sitevisit.csv"); // Adjust the path as needed

  // Check if file exists
  if (!fs.existsSync(csvFilePath)) {
    return res.status(400).send("CSV file not found");
  }
  const employeeResp = await employeeModel.find();

  // Read and parse the CSV file
  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      // Process each row in the CSV
      for (const row of results) {
        try {
          // console.log(row.firstName);
          // console.log(row.lastName);
          // console.log(row.Email);
          const firstName = row.firstName;
          const lastName = row.lastName;
          const namePrefix = row.Name.split(".")[0];
          const gender = getGender(namePrefix);
          // row.Name.toLowerCase().contains("mrs") ||
          // row.Name.toLowerCase().contains("ms")
          //   ? "female"
          //   : "male";

          const email = row.Email != "" ? row.Email : "emailNotFound@gmail.com";
          const phoneNumber =
            row.Phone != ""
              ? row.Phone.length >= 12
                ? row.Phone.substring(2, row.Phone.length)
                : row.Phone
              : null;
          const residence = row.Residence != "" ? row.Residence : null;
          const projects = row.Project != "" ? row.Project?.split(",") : [];
          const choiceApt =
            row["Choice of Apartment"] != ""
              ? row["Choice of Apartment"]?.split(",")
              : [];
          const source = row.Source != "" ? row.Source : null;
          const feedback = row["Customer Feedback"];
          const attendedBy =
            row["ATTENDED BY"] != "" ? row["ATTENDED BY"]?.split(" ")[0] : null;
          const followUpBy =
            row["FOLLOW UP BY"] != "" ? row["FOLLOW UP BY"]?.split(" ")[0] : null;
          const team = row.TEAM != "" ? row.TEAM : null;
          const attendedBy2 =
            employeeResp.find(
              (ele) => ele.firstName.toLowerCase() === attendedBy?.toLowerCase()
            )?._id || null;

          const closingManager =
            employeeResp.find(
              (ele) => ele.firstName.toLowerCase() === followUpBy?.toLowerCase()
            )?._id || null;
          const date = row.Date != "" ? convertStringToDate(row.Date) : new Date();

          data.push({
            date,
            firstName,
            lastName,
            gender,
            namePrefix,
            email,
            phoneNumber,
            residence,
            projects,
            choiceApt,
            source,
            feedback,
            attendedBy: attendedBy2,
            followUpBy,
            team,
            closingManager,
          });
          // Find staff by firstName
          // const staff = await Staff.findOne({ firstName: row.firstName });
          // if (staff) {
          //   // Update staff information
          //   // Adjust these fields according to your CSV structure and Staff model
          //   staff.lastName = row.lastName || staff.lastName;
          //   staff.email = row.email || staff.email;
          //   staff.department = row.department || staff.department;
          //   // Add more fields as needed
          //   await staff.save();
          //   console.log(`Updated staff member: ${staff.firstName}`);
          // } else {
          //   errors.push(`Staff member not found: ${row.firstName}`);
          // }
        } catch (error) {
          errors.push(`Error updating ${row.firstName}: ${error.message}`);
        }
      }

      console.log("Starting bulk insert...");
      const startTime = Date.now();

      await insertDataInBatches(data);

      const endTime = Date.now();
      console.log(`Bulk insert completed in ${(endTime - startTime) / 1000} seconds`);

      // Send response
      res.json({
        message: "CSV processing completed",
        updatedCount: results.length - errors.length,
        errors: errors,
        data: data,
        dataLength: data.length,
      });
    });
});

export default siteVisitRouter;

function getGender(prefix) {
  if (prefix.toLowerCase() === "mrs" || prefix.toLowerCase() === "ms") {
    return "female";
  } else if (prefix.toLowerCase() === "mr") {
    return "male";
  }
  return "other";
}

function convertStringToDate(dateString) {
  // Split the date string into day, month, and year
  const [day, month, year] = dateString.split("-");

  // Create a new Date object
  // Note: month is 0-indexed in JavaScript Date, so we subtract 1
  return new Date(year, month - 1, day);
}

async function insertDataInBatches(data, batchSize = 1000) {
  const totalRecords = data.length;
  let insertedCount = 0;

  for (let i = 0; i < totalRecords; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    await siteVisitModel.insertMany(batch, { ordered: false });
    insertedCount += batch.length;
    console.log(`Inserted ${insertedCount} out of ${totalRecords} records`);
  }
}
