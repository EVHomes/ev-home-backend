import { Router } from "express";
import {
  addLead,
  assignLeadToPreSaleExecutive,
  assignLeadToTeamLeader,
  checkLeadsExists,
  deleteLead,
  getAllLeads,
  getLeadById,
  getLeadsTeamLeader,
  getSimilarLeadsById,
  searchLeads,
  updateLead,
  getLeadsPreSalesExecutive,
  updateCallHistoryPreSales,
  getLeadCounts,
  getLeadCountsByTeamLeaders,
  getAllLeadCountsFunnel,
  getLeadCountsByChannelPartner,
  getLeadCountsByTeamLeader,
  getLeadCountsByPreSaleExecutve,
  getAllLeadCountsFunnelForPreSaleTL,
  rejectLeadById,
  // getAllLeadsWithValidity
} from "../../controller/lead.controller.js";
import { authenticateToken } from "../../middleware/auth.middleware.js";
import { validateLeadsFields } from "../../middleware/lead.middleware.js";
import { fileURLToPath } from "url";
import fs from "fs";
import csv from "csv-parser";
import path from "path";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import cpModel from "../../model/channelPartner.model.js";
import { encryptPassword } from "../../utils/helper.js";
import employeeModel from "../../model/employee.model.js";
import leadModel from "../../model/lead.model.js";
import ourProjectModel from "../../model/ourProjects.model.js";
import jsonLeads from "./ev_homes_main.leads.json" assert { type: "json" };

dayjs.extend(customParseFormat);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const leadRouter = Router();

leadRouter.get("/leads", authenticateToken, getAllLeads);
leadRouter.get("/leads-team-leader/:id", authenticateToken, getLeadsTeamLeader);

leadRouter.get("/leads-pre-sales-executive/:id", getLeadsPreSalesExecutive);

leadRouter.post("/lead-update-caller/:id", authenticateToken, updateCallHistoryPreSales);
leadRouter.get(
  "/search-lead",
  //  authenticateToken,
  searchLeads
);

leadRouter.get("/lead/:id", authenticateToken, getLeadById);

leadRouter.get("/similar-leads/:id", authenticateToken, getSimilarLeadsById);

leadRouter.post("/lead-assign-tl/:id", authenticateToken, assignLeadToTeamLeader);
leadRouter.post("/lead-reject/:id", authenticateToken, rejectLeadById);

leadRouter.post(
  "/lead-assign-pre-sale-executive/:id",
  authenticateToken,
  assignLeadToPreSaleExecutive
);

leadRouter.post("/leads-add", authenticateToken, validateLeadsFields, addLead);
leadRouter.post("/lead-update/:id", authenticateToken, updateLead);
leadRouter.delete("/lead/:id", authenticateToken, deleteLead);
leadRouter.get("/leads-exists/:phoneNumber", authenticateToken, checkLeadsExists);

//for data analyser
leadRouter.get("/lead-count", getLeadCounts);

leadRouter.get(
  "/lead-count-pre-sale-team-leader-for-data-analyser",
  getLeadCountsByTeamLeaders
);
leadRouter.get("/lead-count-channel-partners", getLeadCountsByChannelPartner);
leadRouter.get("/lead-count-funnel", getAllLeadCountsFunnel);

//pre sales team leader
leadRouter.get("/lead-count-pre-sale-team-leader/:id", getLeadCountsByTeamLeader);

leadRouter.get(
  "/lead-count-pre-sale-executive-for-pre-sale-tl",
  getLeadCountsByPreSaleExecutve
);
leadRouter.get("/lead-count-funnel-pre-sales-tl", getAllLeadCountsFunnelForPreSaleTL);
leadRouter.post("/lead-test-update", async (req, res) => {
  const results = [];
  const dataTuPush = [];
  const csvFilePath = path.join(__dirname, "narayan_lead.csv");

  if (!fs.existsSync(csvFilePath)) {
    return res.status(400).send("CSV file not found");
  }
  const channelPartners = await cpModel.find().lean();
  const employees = await employeeModel.find().lean();

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on("data", (data) => {
      results.push(data);
    })
    .on("end", async () => {
      for (const row of results) {
        const {
          firstName,
          lastName,
          channelPartner,
          phoneNumber,
          project,
          "Team Leader": teamLeader,
          dataAnalyzer,
          approvalStatus,
          startDate,
        } = row;
        let foundCp =
          channelPartners.find((ele) =>
            ele.firmName
              ?.toLowerCase()
              .includes(channelPartner?.toLowerCase().split(" ")[0])
          )?._id || null;

        let teamLeader1 =
          employees.find((ele) =>
            ele.firstName?.toLowerCase().includes(teamLeader?.toLowerCase().split(" ")[0])
          )?._id || null;

        let dataAnalyzer1 =
          employees.find((ele) =>
            ele.firstName
              ?.toLowerCase()
              .includes(dataAnalyzer?.toLowerCase().split(" ")[0])
          )?._id || null;

        dataTuPush.push({
          firstName: firstName?.trim(),
          lastName: lastName?.trim(),
          channelPartner: foundCp,
          phoneNumber: phoneNumber?.trim(),
          project: project?.trim()?.split(","),
          teamLeader: teamLeader1,
          dataAnalyzer: dataAnalyzer1,
          approvalStatus: approvalStatus?.trim(),
          startDate: formatDate1(startDate),
          startDate2: startDate,
        });
      }
      // await leadModel.insertMany(dataTuPush);
      // Send the results only after processing is done
      return res.send(dataTuPush);
    })
    .on("error", (err) => {
      return res.status(500).send({ error: err.message });
    });
});

leadRouter.post("/update-lead2-from-csv", async (req, res) => {
  const results = [];
  const errors = [];
  const csvFilePath = path.join(__dirname, "leads_list2.csv");

  if (!fs.existsSync(csvFilePath)) {
    return res.status(400).send("CSV file not found");
  }

  // Load all channel partners once
  const channelPartners = await cpModel.find().lean();
  const employees = await employeeModel.find().lean();
  const projectsDb = await ourProjectModel.find().lean();

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      const dataToInsert = [];

      for (const row of results) {
        try {
          const {
            "First Name": firstName,
            "Last Name": lastName,
            Source: source,
            "Phone no": phoneNumber,
            "Project Name": projectsStr,
            "Team Leader": teamLeader,
            date3,
            // Time: time,
          } = row;
          // const date2 = parseDate(date);
          const projectsLocal = projectsStr ? projectsStr.split(",") : [];

          // Check for existing firm name based on the specified logic
          let foundCp =
            channelPartners.find((ele) =>
              ele.firmName?.toLowerCase().includes(source?.toLowerCase().split(" ")[0])
            )?._id || null;
          let teamLeader1 =
            employees.find((ele) =>
              ele.firstName
                ?.toLowerCase()
                .includes(teamLeader?.toLowerCase().split(" ")[0])
            )?._id || null;

          let ourProj = [];

          projectsLocal.map((projL) => {
            let projectR = projectsDb.find(
              (ele) => ele?.name?.trim()?.toLowerCase() === projL?.trim()?.toLowerCase()
            );
            ourProj.push(projectR._id);
          });

          // Create new CP if not found
          // if (!foundCp && source) {
          //   try {
          //     const email = `${source
          //       .trim()
          //       .replace(/\s+/g, "")}@gmail.com`.toLowerCase();
          //     const pwd = await encryptPassword("EVCP@1234");
          //     const newCp = await cpModel.create({
          //       firstName: "",
          //       lastName: "",
          //       firmName: source,
          //       email, // Ensure this is unique
          //       gender: "other",
          //       password: pwd,
          //     });
          //     foundCp = newCp._id; // Set foundCp to new CP's ID
          //   } catch (error) {
          //     if (error.code === 11000) {
          //       errors.push(`Duplicate email for ${source}`);
          //     } else {
          //       errors.push(
          //         `Error creating cpModel for ${source}: ${error.message}`
          //       );
          //     }
          //   }
          // }
          // console.log("done ....");

          dataToInsert.push({
            // date,
            startDate: parseDate(date3),
            // time,
            // timestamp: timestamp2,
            dateMain: date3,
            email: null,
            firstName,
            lastName,
            phoneNumber: parsePhoneNumber(phoneNumber) ?? null,
            teamLeader: teamLeader1,
            project: projectsStr,
            // channelPartner: foundCp,
            source,
            // teamLeader1,
            // foundCp,
          });
        } catch (error) {
          errors.push(`Error processing ${row.firstName}: ${error.message}`);
        }
      }

      const n9date = dataToInsert.filter(
        (ts) =>
          // ts.phoneNumber != null
          ts.phoneNumber != null && !ts?.startDate?.toString()?.includes("1999")
      );
      const mappedMerged = jsonLeads.map((ele, i) => {
        const foundSameLead = n9date.find(
          (fele) =>
            fele.phoneNumber === ele.phoneNumber && fele.phoneNumber === ele.phoneNumber
        );
        return ele;
      });
      const today = new Date();

      // const futureLeads = dataToInsert.filter((lead) => lead.startDate > today);

      // Bulk insert data
      // try {
      //   await leadModel.insertMany(n9date);
      //   res.json({
      //     message: "CSV processing completed",
      //     updatedCount: results.length - errors.length,
      //     errors,
      //     dataLength: n9date.length,
      //     data: n9date,
      //   });
      // } catch (error) {
      //   res
      //     .status(500)
      //     .json({ message: "Bulk insert failed", error: error.message });
      // }
      // const filterdName = dataToInsert.filter((ld) =>
      //   ld?.startDate?.includes("1999")
      // );
      res.json(n9date);
    });
});

leadRouter.post("/fix-project-miss-leads", async (req, res) => {
  try {
    const resp = await leadModel.find({ project: { $size: 0 } });
    const ids = resp.map((ele) => ele._id);

    const update = await leadModel.updateMany(
      { _id: { $in: ids } }, // Use $in to match IDs
      { project: ["Ev 9 Square", "Marina Bay"] } // Set project array
    );

    return res.send({
      message: "Projects updated successfully",
      modifiedCount: update.modifiedCount,
      matchedCount: update.matchedCount,
      data: update,
    });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

leadRouter.get(
  "/similar-leads2",
  // authenticateToken,
  checkLeadsExists
);

const parsePhoneNumber = (phoneStr) => {
  if (!phoneStr || phoneStr == "") {
    return 0;
  }
  // Remove all non-numeric characters using regex
  const cleanedStr = phoneStr.replace(/[^\d]/g, ""); // Keep only digits
  return cleanedStr; // Returns the cleaned phone number as a string
};

// leadRouter.post("/update-lead2-from-csv", async (req, res) => {
//   const results = [];
//   const data = [];
//   const errors = [];
//   console.log(__dirname);
//   const csvFilePath = path.join(__dirname, "clientTagging_3.csv");

//   // Check if file exists
//   if (!fs.existsSync(csvFilePath)) {
//     return res.status(400).send("CSV file not found");
//   }
//   const channelPartners = await cpModel.find();

//   // Read and parse the CSV file
//   fs.createReadStream(csvFilePath)
//     .pipe(csv())
//     .on("data", (data) => results.push(data))
//     .on("end", async () => {
//       // Process each row in the CSV
//       for (const row of results) {
//         try {
//           const firstName = row.firstName;
//           const lastName = row.lastName;
//           const phoneNumber = row["Client Number"];
//           const projects =
//             row["Project Name"] != "" ? row["Project Name"].split(",") : [];
//           const source = row.Source;
//           const teamLeader = row["Team Leader"];
//           const timestamp = row["timestamp2"];
//           const dateMain = row["Date"];
//           const time = row["Time"];
//           const date =
//             row["timestamp2"] != ""
//               ? parseDate(row["timestamp2"])
//               : row["Date"] != ""
//               ? parseDate(row["Date"])
//               : null;
//           let foundCp =
//             channelPartners.find((ele) =>
//               ele.firmName
//                 ?.toLowerCase()
//                 .includes(source?.toLowerCase()?.split(" ")[0])
//             )?._id || null;

//           if (!foundCp && source != "") {
//             try {
//               const pwd = await encryptPassword("EVCP@1234");
//               const newCp = await cpModel.create({
//                 firstName: "",
//                 lastName: "",
//                 firmName: source,
//                 email: `${source}@gmail.com`,
//                 gender: "other",
//                 password: pwd,
//               });
//               foundCp = newCp;
//             } catch (error) {
//               errors.push(error?.message);
//             }
//           }
//           data.push({
//             date,
//             time,
//             timestamp,
//             dateMain,
//             firstName,
//             lastName,
//             phoneNumber,
//             teamLeader,
//             projects,
//             source,
//             foundCp,
//           });
//         } catch (error) {
//           errors.push(`Error updating ${row.firstName}: ${error.message}`);
//         }
//       }

//       // console.log("Starting bulk insert...");
//       // const startTime = Date.now();

//       // await insertDataInBatches(data);

//       // const endTime = Date.now();
//       // console.log(
//       //   `Bulk insert completed in ${(endTime - startTime) / 1000} seconds`
//       // );

//       // Send response
//       res.json({
//         message: "CSV processing completed",
//         updatedCount: results.length - errors.length,
//         errors: errors,
//         data: data,
//         dataLength: data.length,
//       });
//     });
// });

export default leadRouter;
dayjs.extend(customParseFormat);

const formatDate1 = (dateString) => {
  const [day, month, year] = dateString.split("-").map(Number); // Split and parse
  const date2 = new Date(year, month - 1, day); // Month is zero-based in JavaScript
  return date2;
};
const parseDate = (dateInput) => {
  const formats = [
    // "M/D/YYYY HH:mm:ss", // 7/19/2024 12:27:35
    // "M/D/YYYY", // 7/19/2024
    "DD-MM-YYYY", // 07-06-2024
    // "M-D-YYYY HH:mm:ss", // 7-19-2024 12:27:35
    // "DD-MM-YYYY", // 23-09-2024
  ];

  // Check if dateInput is a number (Excel serial)
  if (!isNaN(dateInput) && Number.isInteger(parseFloat(dateInput))) {
    const serial = parseInt(dateInput, 10);
    const baseDate = new Date(1899, 11, 30);
    return new Date(baseDate.getTime() + serial * 24 * 60 * 60 * 1000);
  }

  // Attempt strict parsing for strings
  for (const format of formats) {
    const date = dayjs(dateInput, format, true); // Strict mode
    if (date.isValid()) {
      return date.toDate();
    }
  }

  // Fallback to non-strict parsing if strict parsing fails
  for (const format of formats) {
    const date = dayjs(dateInput, format); // Non-strict mode
    if (date.isValid()) {
      return date.toDate();
    }
  }

  return new Date("1999-01-01T00:00:00Z"); // Return null if no valid format is found
};

const parseDateTime = (dateInput, timeInput = "") => {
  // Define date formats including two-digit years and missing delimiters
  const dateFormats = [
    "M/D/YYYY HH:mm:ss", // 7/19/2024 12:27:35
    "M/D/YYYY", // 7/19/2024
    "MM-DD-YYYY", // 07-06-2024
    "M-D-YYYY HH:mm:ss", // 7-19-2024 12:27:35
    "DD-MM-YYYY", // 23-09-2024
    "MM/DD/YYYY", // 04/072024
    "M/D/YY", // 9/20/24 (two-digit year)
  ];

  // Define time formats including 24-hour format with dots
  const timeFormats = [
    "h.mm.ss A", // 3.52.00 PM
    "HH:mm:ss", // 15:52:00
    "HH.mm.ss", // 16.10.00 (24-hour format with dots)
  ];

  // Handle Excel serial numbers
  if (!isNaN(dateInput) && Number.isInteger(parseFloat(dateInput))) {
    const serial = parseInt(dateInput, 10);
    const baseDate = new Date(1899, 11, 30);
    return new Date(baseDate.getTime() + serial * 24 * 60 * 60 * 1000);
  }

  // Parse the date part
  let parsedDate = null;
  for (const format of dateFormats) {
    const date = dayjs(dateInput, format, true);
    if (date.isValid()) {
      parsedDate = date;
      break;
    }
  }

  // If no valid date, return null
  if (!parsedDate) {
    return null;
  }

  // Parse the time part (if provided) and combine with date
  if (timeInput) {
    let parsedTime = null;
    for (const format of timeFormats) {
      const time = dayjs(timeInput, format, true);
      if (time.isValid()) {
        parsedTime = time;
        break;
      }
    }

    if (parsedTime) {
      const dateWithTime = dayjs(
        parsedDate.format("YYYY-MM-DD") + " " + parsedTime.format("HH:mm:ss")
      );
      return dateWithTime.toDate();
    }
  }

  // Return only the date if time is empty or invalid
  return parsedDate.toDate();
};
