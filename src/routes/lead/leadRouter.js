import { Router } from "express";
import {
  addLead,
  assignLeadToPreSaleExecutive,
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
  leadAssignToTeamLeader,
  getLeadTeamLeaderGraph,
  getLeadsTeamLeaderReportingTo,
  leadUpdateStatus,
  getLeadByStartEndDate,
  generateInternalLeadPdf,
  generateChannelPartnerLeadPdf,
  triggerCycleChange,
  searchLeadsChannelPartner,
  getLeadCountsByChannelPartnerById,
  getCpSalesFunnel,
  get24hrLeadsNameList,
  getSiteVisitLeadByPhoneNumber,
  getLeadTeamLeaderReportingToGraph,
  triggerCycleChangeFunction,
} from "../../controller/lead.controller.js";
import { authenticateToken } from "../../middleware/auth.middleware.js";
import { validateLeadsFields } from "../../middleware/lead.middleware.js";
import { fileURLToPath } from "url";
import fs from "fs";
import csv from "csv-parser";
import path from "path";
import employeeModel from "../../model/employee.model.js";
import cpModel from "../../model/channelPartner.model.js";
import ourProjectModel from "../../model/ourProjects.model.js";
import leadModel from "../../model/lead.model.js";
import moment from "moment-timezone";
import PDFDocument from "pdfkit";
import siteVisitModel from "../../model/siteVisit.model.js";
import { leadPopulateOptions } from "../../utils/constant.js";
import { addSiteVisitsManual } from "../../controller/siteVisit.controller.js";
import triggerHistoryModel from "../../model/triggerLog.model.js";
import { errorRes, successRes } from "../../model/response.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const leadRouter = Router();

leadRouter.get("/leads", authenticateToken, getAllLeads);
leadRouter.get(
  "/leads-team-leader/:id",
  // authenticateToken,
  getLeadsTeamLeader
);
leadRouter.get("/lead-cycle-timeline/:id", async (req, res) => {
  let timeline = [];
  const id = req.params.id;

  try {
    if (!id) return res.send(errorRes(401, "id required"));

    const leadResp = await leadModel.findById(id);
    timeline.push(...leadResp.cycleHistory, leadResp.cycle);
    let newTimeLine = timeline.map((ele) => {
      ele.validTill = moment(ele.validTill)
        .tz("Asia/Kolkata")
        .format("DD-MM-YYYY HH:mm");
      ele.validTill2 = moment(ele.validTill)
        .tz("Asia/Kolkata")
        .format("DD-MM-YYYY HH:mm");

      return ele;
    });
    return res.send(
      successRes(200, "get 2", {
        data: newTimeLine,
      })
    );
  } catch (error) {
    console.log(error);
    return res.send(errorRes(500, "Internal Server Error"));
  }
});

leadRouter.get(
  "/leads-team-leader-reporting/:id",
  // authenticateToken,
  getLeadsTeamLeaderReportingTo
);

leadRouter.get(
  "/leads-team-leader-graph/:id",
  // authenticateToken,
  getLeadTeamLeaderGraph
);
leadRouter.get(
  "/leads-team-leader-reporting-graph/:id",
  // authenticateToken,
  getLeadTeamLeaderReportingToGraph
);

leadRouter.get("/leads-pre-sales-executive/:id", getLeadsPreSalesExecutive);

leadRouter.post(
  "/lead-update-caller/:id",
  authenticateToken,
  updateCallHistoryPreSales
);
leadRouter.get(
  "/search-lead",
  //  authenticateToken,
  searchLeads
);
leadRouter.get(
  "/search-lead-channel-partner/:id",
  //  authenticateToken,
  searchLeadsChannelPartner
);

leadRouter.post(
  "/lead-update-status/:id",
  // authenticateToken,
  leadUpdateStatus
);

leadRouter.get("/lead/:id", authenticateToken, getLeadById);

leadRouter.get("/similar-leads/:id", authenticateToken, getSimilarLeadsById);

leadRouter.post(
  "/lead-assign-tl/:id",
  authenticateToken,
  leadAssignToTeamLeader
);
leadRouter.post("/lead-reject/:id", authenticateToken, rejectLeadById);

leadRouter.post(
  "/lead-assign-pre-sale-executive/:id",
  authenticateToken,
  assignLeadToPreSaleExecutive
);

leadRouter.post("/leads-add", validateLeadsFields, addLead);
leadRouter.post("/lead-update/:id", authenticateToken, updateLead);
leadRouter.delete("/lead/:id", authenticateToken, deleteLead);
leadRouter.get(
  "/leads-exists/:phoneNumber",
  authenticateToken,
  checkLeadsExists
);

//for data analyser
leadRouter.get("/lead-count", getLeadCounts);
leadRouter.get("/lead-cp-sales-funnel/:id", getCpSalesFunnel);
leadRouter.get("/lead-24-hr-leads-list", get24hrLeadsNameList);

leadRouter.get(
  "/lead-count-pre-sale-team-leader-for-data-analyser",
  getLeadCountsByTeamLeaders
);
leadRouter.get("/lead-count-channel-partners", getLeadCountsByChannelPartner);
leadRouter.get(
  "/lead-count-channel-partners-id/:id",
  getLeadCountsByChannelPartnerById
);

leadRouter.get("/lead-count-funnel", getAllLeadCountsFunnel);

//pre sales team leader
leadRouter.get(
  "/lead-count-pre-sale-team-leader/:id",
  getLeadCountsByTeamLeader
);

leadRouter.get(
  "/lead-count-pre-sale-executive-for-pre-sale-tl",
  getLeadCountsByPreSaleExecutve
);
leadRouter.get(
  "/lead-count-funnel-pre-sales-tl",
  getAllLeadCountsFunnelForPreSaleTL
);

leadRouter.post("/lead-by-start-end-date", getLeadByStartEndDate);
leadRouter.get(
  "/similar-leads2",
  // authenticateToken,
  checkLeadsExists
);
const parseDate = (dateString, timeString = "12:00:00") => {
  // Split the date string into day, month, year
  const [day, month, year] = dateString.split("-").map(Number);

  // Split the time string into hours, minutes, seconds
  const [hours, minutes, seconds] = timeString.split(":").map(Number);

  // Create a new Date object with the specified date and time in UTC
  const date = new Date(
    Date.UTC(year, month - 1, day, hours, minutes, seconds)
  );

  // Adjust to IST by adding 5 hours and 30 minutes
  date.setUTCHours(date.getUTCHours() + 5);
  date.setUTCMinutes(date.getUTCMinutes() + 30);

  return date;
};

// Example usage
// const result = parseDate("26-12-2024", "17:00:00"); // 5 PM IST

// const parseDate = (dateString) => {
//   // Split the string into day, month, year
//   const [day, month, year] = dateString.split("-").map(Number);
//   // const [day, month, year] = dateString.split("-").map(Number);

//   // Create a new Date object
//   const date = new Date(year, month - 1, day); // Adjust year and month (0-indexed)

//   return date;
// };

leadRouter.get("/sitevisitLead-phoneNumber/:id", getSiteVisitLeadByPhoneNumber);

leadRouter.get("/lead-pdf-self", generateInternalLeadPdf);
leadRouter.get("/lead-pdf-cp", generateChannelPartnerLeadPdf);
leadRouter.get("/lead-trigger-cycle-change", triggerCycleChange);
leadRouter.get("/lead-trigger-cycle--test", async (req, res) => {
  try {
    const resp = await triggerCycleChangeFunction();
    // await triggerHistoryModel.create({
    //   date: new Date(),
    //   changes: resp?.changes ?? [],
    //   changesString: resp?.changesString ?? "",
    //   totalTrigger: resp?.total ?? 0,
    //   message: resp?.message ?? "",
    // });

    return res.send(resp);
  } catch (error) {
    return res.send(error);
  }
});
leadRouter.get("/lead-tagging-over-check", async (req, res) => {
  const date1 = new Date();
  try {
    // const tagginOverLeads = await leadModel.find({
    //   stage: "approval",
    //   validTill: { $lt: date1 },
    //   leadType: { $ne: "walk-in" },
    //   visitStatus: "pending",
    // });
    const tagginOverLeads = await leadModel.find({
      stage: "approval",
      // approvalStatus: { $ne: null },
      approvalStatus: { $eq: "approved" },

      validTill: { $gte: date1 },
    });

    // await Promise.all(
    //   tagginOverLeads.map(async (ele) => {
    //     await leadModel.findOneAndUpdate(
    //       { _id: ele._id },
    //       {
    //         stage: "tagging-over",
    //         status: "tagging-over",
    //       }
    //     );
    //   })
    // );

    res.send({ data: tagginOverLeads });
  } catch (error) {
    res.send(data);
  }
});
function getStatus1(lead) {
  if (lead.stage == "visit") {
    return `${lead.stage ?? ""} ${lead.visitStatus ?? ""}`;
  } else if (lead.stage == "revisit") {
    return `${lead.stage ?? ""} ${lead.revisitStatus ?? ""}`;
  } else if (lead.stage == "booking") {
    return `${lead.stage ?? ""} ${lead.bookingStatus ?? ""}`;
  }

  return `${lead.stage ?? ""} ${lead.visitStatus ?? ""}`;
}

// leadRouter.get("/getCycle",(req,res)=> {

//   const results = leadModel.find({ "cycleHistory"});
//   console.log(results);
//   res.send(results);
// });

leadRouter.get("/fix-pending-lead", async (req, res) => {
  try {
    const today = new Date();
    const oldLeads = await leadModel.find({
      stage: { $ne: "tagging-over" },
      approvalStatus: { $ne: "approved" },
      startDate: {
        $gte: new Date("2024-09-25T00:00:00.000Z"), // Filter for December leads
      },
      validTill: {
        $lt: new Date("2025-01-01T00:00:00.000Z"),
      },
    });

    // Separate expired and valid leads
    const validLeads = [];
    const expiredLeads = [];

    oldLeads.forEach((ele) => {
      if (ele.validTill < today) {
        expiredLeads.push(ele._id);
      } else {
        validLeads.push({ id: ele._id, phoneNumber: ele.phoneNumber });
      }
    });

    // Update only valid leads
    if (expiredLeads.length > 0) {
      // await leadModel.updateMany(
      //   { _id: { $in: expiredLeads } },
      //   { $set: { stage: "tagging-over" } }
      // );
    }

    return res.status(200).send({
      total: oldLeads.length,
      updated: validLeads.length,
      expired: expiredLeads.length,
      data: { validLeads, expiredLeads },
    });
  } catch (error) {
    console.error("Error updating leads:", error);
    return res.status(500).send({
      message: "An error occurred while processing leads",
      error: error.message,
    });
  }
});

// leadRouter.get("/fix-pending-lead", async (req, res) => {
//   try {
//     const today = new Date();
//     const oldLeads = await leadModel.find({
//       stage: { $ne: "tagging-over" },
//       approvalStatus: { $ne: "approved" },
//       startDate: {
//         $gte: new Date("2024-09-25T00:00:00.000Z"), // Filter for December leads
//         $lt: new Date("2024-12-28T00:00:00.000Z"),
//       },
//     });

//     const leadsToUpdate = oldLeads.filter((ele) => ele.validTill > today);

//     if (leadsToUpdate.length > 0) {
//       const idsToUpdate = leadsToUpdate.map((ele) => ele._id);
//       // await leadModel.updateMany(
//       //   { _id: { $in: idsToUpdate } },
//       //   { $set: { stage: "tagging-over" } }
//       // );
//     }

//     return res.status(200).send({
//       total: oldLeads.length,
//       updated: leadsToUpdate.length,
//       left: oldLeads.length - leadsToUpdate.length,
//       data: oldLeads,
//     });
//   } catch (error) {
//     console.error("Error updating leads:", error);
//     return res.status(500).send({
//       message: "An error occurred while processing leads",
//       error: error.message,
//     });
//   }
// });
leadRouter.get("/ok", (req, res) => {
  // Online Javascript Editor for free
  // Write, Edit and Run your Javascript code using JS Online Compiler

  console.log("Try programiz.pro");

  function parseUnitNumber(unit) {
    // Split the unit string into floor and number based on the length of the unit
    const floor = Math.floor(unit / 100); // Extract floor by dividing by 100
    const number = unit % 100; // Extract unit number by taking the remainder
    return { floor, number };
  }
  const ok = list.map((ele) => {
    const parsed = parseUnitNumber(parseInt(ele.flatNo));
    ele.floor = parsed.floor;
    ele.number = parsed.number;
    if (ele.number === 2 || ele.number === 9) {
      ele.configuration = "2BHK";
    } else {
      ele.configuration = "3BHK";
    }
    ele.allInclusiveValue = 0;
    ele.sellableCarpetArea = Math.ceil(ele.sellableCarpetArea);
    ele.type = "";
    return ele;
  });
  res.send(ok);
});

leadRouter.get("/lead-cycleHistory", async (req, res) => {
  try {
    const filterDate = new Date("2024-12-28");
    const filterDatelat = new Date("2024-12-30");
    const timeZone = "Asia/Kolkata";

    // Fetch leads with the filtering criteria
    const resp = await leadModel.find({
      "cycle.startDate": { $gte: filterDate, $lt: filterDatelat },
      leadType: { $ne: "walk-in" },
    });

    const cycleChanges = resp.filter((ele) => ele.cycleHistory.length > 0);

    // Define the fields for CSV
    const fields = [
      "id",
      "firstName",
      "lastName",
      "phoneNumber",
      "channelPartner",
      "currentCycleTeamLeader",
      "currentCycleOrder",
      "currentCycleStage",
      "currentCycleAssignDate",
      "currentCycleDeadline",
      "cycleHistory[0].order",
      "cycleHistory[0].teamLeader",
      "cycleHistory[0].stage",
      "cycleHistory[0].AssignDate",
      "cycleHistory[0].Deadline",
    ];

    // Prepare CSV header
    const header = fields.join(",") + "\n";

    // Prepare CSV rows
    const csvRows = cycleChanges.map((lead) => {
      return fields
        .map((field) => {
          switch (field) {
            case "id":
              return `"${lead._id || ""}"`;

            case "firstName":
              return `"${lead.firstName || ""}"`;
            case "lastName":
              return `"${lead.lastName || ""}"`;
            case "phoneNumber":
              return `"${lead.phoneNumber || ""}"`;
            case "channelPartner":
              return `"${lead.channelPartner || "NA"}"`;

            case "currentCycleTeamLeader":
              return lead.cycle?.teamLeader
                ? `"${lead.cycle.teamLeader}"`
                : '""';
            case "currentCycleStage":
              return lead.cycle?.stage ? `"${getStatus1(lead)}"` : '""';
            case "currentCycleOrder":
              return lead.cycle?.currentOrder
                ? `"${lead.cycle.currentOrder}"`
                : '""';
            case "currentCycleAssignDate":
              return lead.cycle?.startDate
                ? `"${moment(lead.cycle.startDate)
                    .tz(timeZone)
                    .format("DD-MM-YYYY HH:mm")}"`
                : '""';
            case "currentCycleDeadline":
              return lead.cycle?.validTill
                ? `"${moment(lead.cycle.validTill)
                    .tz(timeZone)
                    .format("DD-MM-YYYY HH:mm")}"`
                : '""';

            case "cycleHistory[0].order":
              return lead.cycleHistory[0]?.currentOrder
                ? `"${lead.cycleHistory[0].currentOrder}"`
                : '""';
            case "cycleHistory[0].teamLeader":
              return lead.cycleHistory[0]?.teamLeader
                ? `"${lead.cycleHistory[0].teamLeader}"`
                : '""';
            case "cycleHistory[0].stage":
              return lead.cycleHistory[0]?.stage
                ? `"${lead.cycleHistory[0].stage}"`
                : '""';
            case "cycleHistory[0].AssignDate":
              return lead.cycleHistory[0]?.startDate
                ? `"${moment(lead.cycleHistory[0].startDate)
                    .tz(timeZone)
                    .format("DD-MM-YYYY HH:mm")}"`
                : '""';
            case "cycleHistory[0].Deadline":
              return lead.cycleHistory[0]?.validTill
                ? `"${moment(lead.cycleHistory[0].validTill)
                    .tz(timeZone)
                    .format("DD-MM-YYYY HH:mm")}"`
                : '""';

            default:
              return '""'; // Default empty string for any undefined fields
          }
        })
        .join(",");
    });

    // Combine header and rows
    const csvContent = header + csvRows.join("\n");

    // Write CSV to a file
    const filePath = "./cycleHistory.csv";
    fs.writeFileSync(filePath, csvContent);

    // Send the file for download
    return res.download(filePath, "cycleHistory.csv", (err) => {
      if (err) {
        return res.status(500).send({ error: "Error downloading file" });
      }
      // Clean up the file after download
      fs.unlinkSync(filePath);
    });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});
/*
    const filterDate = new Date("2024-12-10");

    const allCycleExpiredLeads = await leadModel.find({
      "cycle.validTill": { $lt: currentDate },
      startDate: { $gte: filterDate },
      bookingStatus: { $ne: "booked" },
    });



*/
leadRouter.get("/all-leads", async (req, res) => {
  try {
    const filterDate = new Date("2024-12-10");
    console.log(filterDate);
    const allLeads = await leadModel.find({
      startDate: { $gte: filterDate },
      bookingStatus: { $ne: "booked" },
    });

    const cycleHistoryNotEmpty = allLeads.filter(
      (el) => el.cycleHistory.length >= 3
    );

    const onlyWalkin = cycleHistoryNotEmpty.filter(
      (el) => el.leadType === "walk-in"
    );
    res.send({
      total: allLeads.length,
      cycleHLength: cycleHistoryNotEmpty.length,
      onlyWalkinLength: onlyWalkin.length,
      // onlyWalkin,
      // data: allLeads,
      cycleHistoryNotEmpty,
    });
  } catch (error) {
    res.send(error);
  }
});

leadRouter.get("/removed-assigned", async (req, res) => {
  try {
    const filterDate = new Date("2024-12-10");
    console.log(filterDate);
    const allLeads = await leadModel
      .find({
        startDate: { $gte: filterDate },
        "cycle.currentOrder": { $gt: 1 },
        bookingStatus: { $ne: "booked" },
      })
      .populate(leadPopulateOptions);

    const onlyWalkin = allLeads.filter(
      (el) => el.taskRef?.assignTo?.reportingTo?._id != el.cycle.teamLeader?._id
    );
    // await Promise.all(
    //   allLeads.map(async (el) => {
    //     if (
    //       el.taskRef?.assignTo?.reportingTo?._id != el.cycle.teamLeader?._id
    //     ) {
    //       await leadModel.findByIdAndUpdate(el._id, {taskRef: null})
    //     }
    //   })
    // );

    res.send({
      total: allLeads.length,
      onlyWalkinLength: onlyWalkin.length,
      onlyWalkin,
      // data: allLeads,
    });
  } catch (error) {
    res.send(error);
  }
});

// leadRouter.post("/lead-cycleHistory", async (req, res) => {
//   try {
//     const filterDate = new Date("2024-12-10");
//     const filterDatelat = new Date("2024-12-11");

//     const resp = await leadModel.find({
//       startDate: { $gte: filterDate, $lt: filterDatelat },
//       leadType: { $ne: "walk-in" },
//       // currentOrder: { $gt: 0 },
//     });
//     const cycleChanges = resp.map((ele) => {
//       if (ele.cycleHistory.length > 0) {
//         // if (ele.cycleHistory[0].startDate)
//         return ele;
//       }
//     });

//     return res.send({ total: cycleChanges.length, data: cycleChanges });
//   } catch (error) {
//     return res.send({ data: error });
//   }
// });
leadRouter.post("/lead-updates", async (req, res) => {
  const results = [];
  const dataTuPush = [];
  const csvFilePath = path.join(__dirname, "lead_01_01_24.csv");

  const cpResp = await cpModel.find();
  const teamLeaders = await employeeModel.find({
    $or: [
      { designation: "desg-senior-closing-manager" },
      { designation: "desg-site-head" },
      { designation: "desg-post-sales-head" },
    ],
  });
  const dataAnalyzers = await employeeModel.find({
    designation: "desg-data-analyzer",
  });

  const projectsResp = await ourProjectModel.find({});

  if (!fs.existsSync(csvFilePath)) {
    return res.status(400).send("CSV file not found");
  }
  let i = 0;

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on("data", (data) => {
      results.push(data);
    })
    .on("end", async () => {
      for (const row of results) {
        const {
          Leadreceivedon,
          Name: firstName,
          Surname: lastName,
          Number: phoneNumber,
          Cp,
          TeamLeaderDate: leadAssignDate,
          Teamleader,
          Project,
          Requirement,
          taggingstatus,
          "Data Analyer": anayl,
        } = row;
        let startDate = parseDate(Leadreceivedon, "6:00:00");
        let cycleStartDate = parseDate(leadAssignDate, "6:00:00");
        let requirement = Requirement.replace(/\s+/g, "")
          .toUpperCase()
          ?.split(",");
        let projs = [];
        Project.split(",").map((ojk) => {
          // console.log(ojk);

          let projects = projectsResp.find((proj) => {
            if (proj.name.toLowerCase().includes(ojk.split(" ")[0])) {
              projs.push(proj?._id);
            }
          });
        });

        let newTeamleader =
          teamLeaders.find((tl) =>
            tl.firstName
              .toLowerCase()
              .includes(Teamleader.split(" ")[0].toLowerCase())
          )?._id ?? null;

        let channelPartner =
          cpResp.find((cp) =>
            cp.firmName.toLowerCase().includes(Cp.toLowerCase())
          )?._id ?? null;

        // if (Cp != "") {
        //   const newCpId = Cp?.replace(/\s+/g, "-").toLowerCase();
        //   try {
        //     const newCp = await cpModel.create({
        //       _id: newCpId,
        //       email: Cp?.replace(/\s+/g, "").toLowerCase() + "@gmail.com",
        //       firmName: Cp.toLowerCase(),
        //       password: "Evhomecp",
        //     });
        //     channelPartner = newCp._id;
        //   } catch (error) {}
        // }

        let dataAnalyzer = dataAnalyzers.find((dt) =>
          dt.firstName
            ?.toLowerCase()
            ?.includes(anayl?.split(" ")[0]?.toLowerCase())
        )?._id;

        i = i >= 1 ? 0 : 1;
        const validTill = new Date(cycleStartDate);
        validTill.setDate(validTill.getDate() + 14);
        const taggingValidTill = new Date(startDate);
        taggingValidTill.setDate(taggingValidTill.getDate() + 59);

        // i++;
        dataTuPush.push({
          firstName,
          lastName,
          phoneNumber: parseInt(phoneNumber.replace(/\s+/g, "").toLowerCase()),
          teamLeader: newTeamleader,
          channelPartner,
          dataAnalyzer,
          requirement,
          approvalStatus: taggingstatus?.toLowerCase(),
          approvalDate: cycleStartDate,
          approvalRemark: "approved",
          startDate,
          validTill: taggingValidTill,
          cycleStartDate,
          stage: "visit",
          project: projs,
          cycle: {
            nextTeamLeader: null,
            stage: "visit",
            currentOrder: 1,
            teamLeader: newTeamleader,
            startDate: cycleStartDate,
            validTill: validTill,
          },
          approvalHistory: [
            {
              employee: dataAnalyzer,
              approvedAt: cycleStartDate,
              remark: "approved",
            },
          ],
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

// leadRouter.post("/visit-updates", async (req, res) => {
//   const results = [];
//   const dataTuPush = [];
//   const csvFilePath = path.join(__dirname, "visit-import.csv");

//   const cpResp = await cpModel.find();
//   const teamLeaders = await employeeModel.find({
//     $or: [
//       {
//         designation: "desg-site-head",
//       },
//       {
//         designation: "desg-senior-closing-manager",
//       },
//       //added as per request bcz of harshal desg changed
//       {
//         designation: "desg-post-sales-head",
//       },
//     ],
//   });
//   const salesmanager = await employeeModel.find({
//     $or: [
//       {
//         designation: "desg-senior-sales-manager",
//       },
//       {
//         designation: "desg-sales-executive",
//       },
//       {
//         designation: "desg-sales-manager",
//       },
//       {
//         designation: "desg-pre-sales-executive",
//       },
//     ],
//   });

//   const projectsResp = await ourProjectModel.find({});

//   if (!fs.existsSync(csvFilePath)) {
//     return res.status(400).send("CSV file not found");
//   }
//   let i = 0;

//   fs.createReadStream(csvFilePath)
//     .pipe(csv())
//     .on("data", (data) => {
//       results.push(data);
//     })
//     .on("end", async () => {
//       for (const row of results) {
//         const {
//           date_1: Date,
//           date_2,
//           "First Name": firstName,
//           "Last Name": lastName,
//           Phone: phoneNumber,
//           Email: email,
//           Residence: address,
//           Project,
//           "Choice of Apartment": Requirement,
//           Source1: cp,
//           Source1: source,
//           "Customer Feedback": feedback,
//           "Visit Type": vistType,
//           "ATTENDED BY": attendedBy,
//           TEAM: team,
//           TEAM: teamleader,
//         } = row;
//         let projs = [];

//         let projects = Project.split(",").map((pro) => {
//           const projs = projectsResp.find((proj) =>
//             proj.name.toLowerCase().includes(pro.split("")[0])
//           )?._id;
//           if (projs) {
//             return projs;
//           }
//         });

//         let newTeamleader =
//           teamLeaders.find((tl) =>
//             tl.firstName
//               .toLowerCase()
//               .includes(teamleader.split(" ")[0].toLowerCase())
//           )?._id ?? null;
//         let test = [];
//         const test2 = attendedBy?.replace(/\s+/g, "").toLowerCase().split(",");
//         console.log(test2);
//         test2.map((ele, i) => {
//           let attendedBy1 =
//             salesmanager.find(
//               (tl) =>
//                 tl.firstName.toLowerCase().includes(ele.toLowerCase()) ||
//                 tl.lastName.toLowerCase().includes(ele.toLowerCase())
//             )?._id ?? null;
//           test.push(attendedBy1);
//         });

//         dataTuPush.push({
//           date: parseDate(Date),
//           firstName,
//           lastName,
//           phoneNumber,
//           email,
//           residence: address,
//           projects: projects,
//           choiceApt: Requirement?.replace(/\s+/g, "").toUpperCase().split(","),
//           cp,
//           source,
//           visitType: vistType,
//           closingTeam: test,
//           closingManager: newTeamleader,
//           location:
//             vistType === "virtual-meeting"
//               ? "project-ev-9-square-vashi-sector-9"
//               : "project-ev-10-marina-bay-vashi-sector-10",
//           verified: true,
//           source: cp,
//         });
//         // let startDate = parseDate(Leadreceivedon);
//         // let cycleStartDate = parseDate(leadAssignDate);
//         // let requirement = Requirement.replace(/\s+/g, "")
//         //   .toUpperCase()
//         //   ?.split(",");

//         // let newTeamleader =
//         //   teamLeaders.find((tl) =>
//         //     tl.firstName
//         //       .toLowerCase()
//         //       .includes(Teamleader.split(" ")[0].toLowerCase())
//         //   )?._id ?? null;

//         // let channelPartner =
//         //   cpResp.find((cp) =>
//         //     cp.firmName.toLowerCase().includes(Cp.split(" ")[0].toLowerCase())
//         //   )?._id ?? null;

//         // // if (Cp != "") {
//         // //   const newCpId = Cp?.replace(/\s+/g, "-").toLowerCase();
//         // //   try {
//         // //     const newCp = await cpModel.create({
//         // //       _id: newCpId,
//         // //       email: Cp?.replace(/\s+/g, "").toLowerCase() + "@gmail.com",
//         // //       firmName: Cp.toLowerCase(),
//         // //       password: "Evhomecp",
//         // //     });
//         // //     channelPartner = newCp._id;
//         // //   } catch (error) {}
//         // // }

//         // let dataAnalyzer = dataAnalyzers[i]?._id ?? null;

//         // i = i >= 1 ? 0 : 1;
//         // const validTill = new Date(cycleStartDate);
//         // validTill.setDate(validTill.getDate() + 15);
//         // // i++;
//         // dataTuPush.push({
//         //   firstName,
//         //   lastName,
//         //   phoneNumber: phoneNumber.replace(/\s+/g, "").toLowerCase(),
//         //   teamLeader: newTeamleader,
//         //   channelPartner,
//         //   dataAnalyzer,
//         //   requirement,
//         //   approvalStatus: taggingstatus,
//         //   approvalDate: cycleStartDate,
//         //   startDate,
//         //   cycleStartDate,
//         //   projects,
//         //   cycle: {
//         //     nextTeamLeader: null,
//         //     stage: "visit",
//         //     currentOrder: 1,
//         //     teamLeader: newTeamleader,
//         //     startDate: cycleStartDate,
//         //     validTill: validTill,
//         //   },
//         // });
//       }
//       const allVisits = await siteVisitModel.find({ source: "walk-in" });
//       const foundLeads = await leadModel.find({
//         visitRef: { $in: allVisits.map((ele) => ele._id) },
//       });
//       console.log(foundLeads.length);

//       // const newdata = await Promise.all(
//       //   foundLeads.map(async (oka) => {
//       //     const found = allVisits.find(
//       //       (ok) => ok?._id?.toString() === oka.visitRef?.toString()
//       //     );
//       //     const startDate = new Date(found.date); // Current date
//       //     const daysToAdd = 30;

//       //     // Properly calculate validTill
//       //     const validTill = new Date(startDate);
//       //     validTill.setDate(validTill.getDate() + daysToAdd);

//       //     oka.cycle = {
//       //       ...oka.cycle,
//       //       startDate: startDate,
//       //       validTill: validTill,
//       //     };
//       //     await oka.save();
//       //     return oka;
//       //   })
//       //   // allVisits.map(async (vis) => {
//       //   //   const found = dataTuPush.find((ok) => ok.firstName === vis.firstName);
//       //   //   vis.date = found.date;
//       //   //   // await vis.save();
//       //   //   return vis;
//       //   // })
//       // );
//       // const datas = await Promise.all(
//       //   dataTuPush.map(async (dta) => {
//       //     dta.id =
//       //       allVisits.find((d) => d.firstName === dta.firstName)?._id || null;
//       //     return dta;
//       //   })
//       // );

//       // Promise.all(
//       //   dataTuPush.map(async (dt) => {
//       //     await addSiteVisitsManual(dt);
//       //   })
//       // );
//       // await siteVisitModel.insertMany(dataTuPush);
//       // Send the results only after processing is done
//       // return res.send(newdata);
//     })
//     .on("error", (err) => {
//       return res.status(500).send({ error: err.message });
//     });
// });
export default leadRouter;
