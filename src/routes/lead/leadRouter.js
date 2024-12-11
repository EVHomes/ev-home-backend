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
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const leadRouter = Router();

leadRouter.get("/leads", authenticateToken, getAllLeads);
leadRouter.get(
  "/leads-team-leader/:id",
  // authenticateToken,
  getLeadsTeamLeader
);

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

leadRouter.get(
  "/lead-count-pre-sale-team-leader-for-data-analyser",
  getLeadCountsByTeamLeaders
);
leadRouter.get("/lead-count-channel-partners", getLeadCountsByChannelPartner);
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

leadRouter.get(
  "/similar-leads2",
  // authenticateToken,
  checkLeadsExists
);
const parseDate = (dateString) => {
  // Split the string into day, month, year
  const [day, month, year] = dateString.split("-").map(Number);

  // Create a new Date object
  const date = new Date(year, month - 1, day); // Adjust year and month (0-indexed)

  return date;
};

leadRouter.get("/lead-pdf", async (req, res) => {
  try {
    const timeZone = "Asia/Kolkata";

    // Get yesterday's date range in local timezone
    const startOfYesterday = moment()
      .tz(timeZone)
      .subtract(1, "day")
      .startOf("day")
      .toDate();
    const endOfYesterday = moment()
      .tz(timeZone)
      .subtract(1, "day")
      .endOf("day")
      .toDate();

    const leads = await leadModel
      .find({
        createdAt: { $gte: startOfYesterday, $lt: endOfYesterday },
      })
      .populate({
        path: "channelPartner",
        select: "-password -refreshToken",
      })
      .populate({
        path: "project",
        select: "name",
      })
      .populate({
        path: "teamLeader",
        select: "firstName lastName",
        populate: [
          { path: "designation" },
          {
            path: "reportingTo",
            select: "firstName lastName",
            populate: [{ path: "designation" }],
          },
        ],
      })
      .populate({
        path: "cycle.teamLeader",
        select: "firstName lastName",
        populate: [
          { path: "designation" },
          {
            path: "reportingTo",
            select: "firstName lastName",
            populate: [{ path: "designation" }],
          },
        ],
      })
      .populate({
        path: "dataAnalyzer",
        select: "firstName lastName",
        populate: [
          { path: "designation" },
          {
            path: "reportingTo",
            select: "firstName lastName",
            populate: [{ path: "designation" }],
          },
        ],
      })
      .populate({
        path: "preSalesExecutive",
        select: "firstName lastName",
        populate: [
          { path: "designation" },
          {
            path: "reportingTo",
            select: "firstName lastName",
            populate: [{ path: "designation" }],
          },
        ],
      })
      .populate({
        path: "approvalHistory.employee",
        select: "firstName lastName",
        populate: [
          { path: "designation" },
          {
            path: "reportingTo",
            select: "firstName lastName",
            populate: [{ path: "designation" }],
          },
        ],
      })
      .populate({
        path: "updateHistory.employee",
        select: "firstName lastName",
        populate: [
          { path: "designation" },
          {
            path: "reportingTo",
            select: "firstName lastName",
            populate: [{ path: "designation" }],
          },
        ],
      })
      .populate({
        path: "callHistory.caller",
        select: "firstName lastName",
        populate: [{ path: "designation" }],
      })
      .populate({
        path: "visitRef",
        populate: [
          { path: "projects", select: "name" },
          {
            path: "closingManager",
            select: "firstName lastName",
            populate: [
              { path: "designation" },
              {
                path: "reportingTo",
                select: "firstName lastName",
                populate: [{ path: "designation" }],
              },
            ],
          },
          {
            path: "attendedBy",
            select: "firstName lastName",
            populate: [
              { path: "designation" },
              {
                path: "reportingTo",
                select: "firstName lastName",
                populate: [{ path: "designation" }],
              },
            ],
          },
          {
            path: "dataEntryBy",
            select: "firstName lastName",
            populate: [
              { path: "designation" },
              {
                path: "reportingTo",
                select: "firstName lastName",
                populate: [{ path: "designation" }],
              },
            ],
          },
          {
            path: "closingTeam",
            select: "firstName lastName",
            populate: [
              { path: "designation" },
              {
                path: "reportingTo",
                select: "firstName lastName",
                populate: [{ path: "designation" }],
              },
            ],
          },
        ],
      })
      .populate({
        path: "revisitRef",
        populate: [
          { path: "projects", select: "name" },
          {
            path: "closingManager",
            select: "firstName lastName",
            populate: [
              { path: "designation" },
              {
                path: "reportingTo",
                select: "firstName lastName",
                populate: [{ path: "designation" }],
              },
            ],
          },
          {
            path: "attendedBy",
            select: "firstName lastName",
            populate: [
              { path: "designation" },
              {
                path: "reportingTo",
                select: "firstName lastName",
                populate: [{ path: "designation" }],
              },
            ],
          },
          {
            path: "dataEntryBy",
            select: "firstName lastName",
            populate: [
              { path: "designation" },
              {
                path: "reportingTo",
                select: "firstName lastName",
                populate: [{ path: "designation" }],
              },
            ],
          },
          {
            path: "closingTeam",
            select: "firstName lastName",
            populate: [
              { path: "designation" },
              {
                path: "reportingTo",
                select: "firstName lastName",
                populate: [{ path: "designation" }],
              },
            ],
          },
        ],
      })
      .populate({
        path: "bookingRef",
        populate: [
          { path: "project", select: "name" },
          {
            path: "closingManager",
            select: "firstName lastName",
            populate: [
              { path: "designation" },
              {
                path: "reportingTo",
                select: "firstName lastName",
                populate: [{ path: "designation" }],
              },
            ],
          },
          {
            path: "postSaleExecutive",
            select: "firstName lastName",
            populate: [
              { path: "designation" },
              {
                path: "reportingTo",
                select: "firstName lastName",
                populate: [{ path: "designation" }],
              },
            ],
          },
        ],
      });

    if (!leads.length) {
      return res.status(404).json({ message: "No leads found for yesterday" });
    }

    // Create PDF document
    const doc = new PDFDocument({ size: "A4", margin: 40 });
    const pdfPath = path.join(__dirname, "leads-yesterday.pdf");
    const pdfStream = fs.createWriteStream(pdfPath);
    doc.pipe(pdfStream);

    // Add title
    doc
      .fontSize(20)
      .text(
        `Leads Report - ${moment(startOfYesterday)
          .tz(timeZone)
          .format("DD-MM-YYYY")}`,
        {
          align: "center",
          underline: true,
        }
      )
      .moveDown();

    // Iterate through leads and add as card-style layout
    leads.forEach((lead, index) => {
      if (doc.y > 700) {
        doc.addPage(); // Add new page if content exceeds height
      }

      // Draw card boundary
      doc.rect(40, doc.y, 510, 150).stroke().moveDown(0.5);

      const cardY = doc.y + 5;

      // Add lead details within the card
      doc
        .fontSize(12)
        .text(`Lead ${index + 1}`, 50, cardY, { align: "left" })
        .text(
          `Name: ${lead.firstName || "N/A"} ${lead.lastName || ""}`,
          50,
          cardY + 15
        )
        .text(
          `Phone: ${lead.countryCode + " " + lead.phoneNumber || "N/A"}`,
          50,
          cardY + 30
        )
        .text(
          `Alt Phone: ${
            lead.altPhoneNumber
              ? lead.countryCode + " " + lead.altPhoneNumber
              : "N/A"
          }`,
          50,
          cardY + 45
        )

        .text(`Email: ${lead.email || "N/A"}`, 50, cardY + 60)
        .text(
          `Projects: ${
            lead.project?.map((proj) => proj.name)?.join(", ") || "N/A"
          }`,
          50,
          cardY + 75
        )
        .text(
          `Requirement: ${lead.requirement?.join(", ") || "N/A"}`,
          50,
          cardY + 90
        )

        .text(`Status: ${getStatus1(lead) || "N/A"}`, 300, cardY + 15)
        .text(
          `Data Analyzer: ${
            lead.dataAnalyzer?.firstName + " " + lead.dataAnalyzer?.lastName ||
            "N/A"
          }`,
          300,
          cardY + 30
        )
        .text(
          `Team Leader: ${
            lead.teamLeader?.firstName + " " + lead.teamLeader?.lastName ||
            "N/A"
          }`,
          300,
          cardY + 45
        )

        .text(
          `Channel Partner: ${lead.channelPartner?.firmName || "N/A"}`,
          300,
          cardY + 60
        )
        // .text(`Status: ${getStatus1(lead) || "N/A"}`, 300, cardY + 60)
        .text(
          `Deadline: ${
            lead.cycle?.validTill
              ? moment(lead.cycle.validTill)
                  .tz(timeZone)
                  .format("DD-MM-YYYY hh:mm:ss a")
              : "N/A"
          }`,
          300,
          cardY + 75
        )
        .text(
          `Tagging Start Date: ${
            lead.startDate
              ? moment(lead.startDate)
                  .tz(timeZone)
                  .format("DD-MM-YYYY hh:mm:ss a")
              : "N/A"
          }`,
          300,
          cardY + 90
        )
        .text(
          `Tagging Valid Till: ${
            lead.validTill
              ? moment(lead.validTill)
                  .tz(timeZone)
                  .format("DD-MM-YYYY hh:mm:ss a")
              : "N/A"
          }`,
          300,
          cardY + 105
        );

      // Add some spacing between cards
      doc.moveDown(4);
    });

    doc.end();

    pdfStream.on("finish", () => {
      res.download(pdfPath, "leads-yesterday.pdf", (err) => {
        if (err) {
          console.error("Error sending file:", err);
          res.status(500).send("Error downloading file.");
        }
        fs.unlinkSync(pdfPath);
      });
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ error: "Internal Server Error" });
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

leadRouter.post("/lead-updates", async (req, res) => {
  const results = [];
  const dataTuPush = [];
  const csvFilePath = path.join(__dirname, "Leads_tl_3.csv");

  const cpResp = await cpModel.find();
  const teamLeaders = await employeeModel.find({
    $or: [
      { designation: "desg-senior-closing-manager" },
      { designation: "desg-site-head" },
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
        } = row;
        let startDate = parseDate(Leadreceivedon);
        let cycleStartDate = parseDate(leadAssignDate);
        let requirement = Requirement.replace(/\s+/g, "")
          .toUpperCase()
          ?.split(",");
        let projects = projectsResp.find((proj) =>
          proj.name.toLowerCase().includes(Project.split("")[0])
        )._id;

        let newTeamleader =
          teamLeaders.find((tl) =>
            tl.firstName
              .toLowerCase()
              .includes(Teamleader.split(" ")[0].toLowerCase())
          )?._id ?? null;

        let channelPartner =
          cpResp.find((cp) =>
            cp.firmName.toLowerCase().includes(Cp.split(" ")[0].toLowerCase())
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

        let dataAnalyzer = dataAnalyzers[i]?._id ?? null;

        i = i >= 1 ? 0 : 1;
        const validTill = new Date(cycleStartDate);
        validTill.setDate(validTill.getDate() + 15);
        // i++;
        dataTuPush.push({
          firstName,
          lastName,
          phoneNumber: phoneNumber.replace(/\s+/g, "").toLowerCase(),
          teamLeader: newTeamleader,
          channelPartner,
          dataAnalyzer,
          requirement,
          approvalStatus: taggingstatus,
          approvalDate: cycleStartDate,
          startDate,
          cycleStartDate,
          projects,
          cycle: {
            nextTeamLeader: null,
            stage: "visit",
            currentOrder: 1,
            teamLeader: newTeamleader,
            startDate: cycleStartDate,
            validTill: validTill,
          },
        });
      }
      await leadModel.insertMany(dataTuPush);
      // Send the results only after processing is done
      return res.send(dataTuPush);
    })
    .on("error", (err) => {
      return res.status(500).send({ error: err.message });
    });
});

export default leadRouter;
