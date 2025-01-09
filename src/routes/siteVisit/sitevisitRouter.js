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
  getClosingManagerSiteVisitById,
  getSiteVisitByPhoneNumber,
  getTeamMemberSiteVisitById
} from "../../controller/siteVisit.controller.js";
import { authenticateToken } from "../../middleware/auth.middleware.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import csv from "csv-parser";
import employeeModel from "../../model/employee.model.js";
import siteVisitModel from "../../model/siteVisit.model.js";
import mongoose from "mongoose";
// import jsonVisits from "./siteVisits_list.json" assert { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const siteVisitRouter = Router();
siteVisitRouter.get(
  "/siteVisit",

  // authenticateToken,
  getSiteVisits
);
siteVisitRouter.get("/siteVisit/:id", authenticateToken, getSiteVisitsById);
siteVisitRouter.get("/siteVisit-phoneNumber/:phoneNumber",getSiteVisitByPhoneNumber);

siteVisitRouter.post(
  "/siteVisits-add",
  // authenticateToken,
  addSiteVisits
);
siteVisitRouter.get(
  "/site-visit-closing-manager/:id",
  getClosingManagerSiteVisitById
);

siteVisitRouter.get("/site-visit-team-member/:id",getTeamMemberSiteVisitById);

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

siteVisitRouter.post(
  "/siteVisit-update/:id",
  authenticateToken,
  updateSiteVisits
);
siteVisitRouter.delete("/siteVisit/:id", authenticateToken, deleteSiteVisits);
siteVisitRouter.get("/siteVisits-search", searchSiteVisits);

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
