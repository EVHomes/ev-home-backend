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
  getLeadCountsByChannelPartnerById
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

leadRouter.get(
  "/lead-count-pre-sale-team-leader-for-data-analyser",
  getLeadCountsByTeamLeaders
);
leadRouter.get("/lead-count-channel-partners", getLeadCountsByChannelPartner);
leadRouter.get("/lead-count-channel-partners-id/:id",getLeadCountsByChannelPartnerById);

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
const parseDate = (dateString) => {
  // Split the string into day, month, year
  const [day, month, year] = dateString.split("-").map(Number);
  // const [day, month, year] = dateString.split("-").map(Number);

  // Create a new Date object
  const date = new Date(year, month - 1, day); // Adjust year and month (0-indexed)

  return date;
};

leadRouter.get("/lead-pdf-self", generateInternalLeadPdf);
leadRouter.get("/lead-pdf-cp", generateChannelPartnerLeadPdf);
leadRouter.get("/lead-trigger-cycle-change", triggerCycleChange);

leadRouter.get("/ok", (req, res) => {
  // Online Javascript Editor for free
  // Write, Edit and Run your Javascript code using JS Online Compiler

  console.log("Try programiz.pro");

  const list = [
    { flatNo: "503", occupied: true, carpetArea: 0, sellableCarpetArea: 0 },
    {
      flatNo: "504",
      occupied: false,
      carpetArea: 0,
      sellableCarpetArea: 0,
    },
    { flatNo: "505", occupied: true, carpetArea: 0, sellableCarpetArea: 0 },
    { flatNo: "506", occupied: true, carpetArea: 0, sellableCarpetArea: 0 },
    {
      flatNo: "507",
      occupied: false,
      carpetArea: 0,
      sellableCarpetArea: 0,
    },
    {
      flatNo: "508",
      occupied: false,
      carpetArea: 0,
      sellableCarpetArea: 0,
    },
    {
      flatNo: "509",
      occupied: false,
      carpetArea: 0,
      sellableCarpetArea: 0,
    },
    {
      flatNo: "510",
      occupied: false,
      carpetArea: 0,
      sellableCarpetArea: 0,
    },
    {
      flatNo: "511",
      occupied: false,
      carpetArea: 0,
      sellableCarpetArea: 0,
    },
    {
      flatNo: "512",
      occupied: false,
      carpetArea: 0,
      sellableCarpetArea: 0,
    },
    {
      flatNo: "601",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "602",
      occupied: true,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "603",
      occupied: false,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "604",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "605",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "606",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "607",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "608",
      occupied: false,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "609",
      occupied: false,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "610",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "701",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "702",
      occupied: true,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "703",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "704",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "705",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "706",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "707",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "708",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "709",
      occupied: false,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "710",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "801",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "802",
      occupied: true,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "803",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "804",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "805",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "806",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "807",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "808",
      occupied: false,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "809",
      occupied: false,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "810",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "901",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "902",
      occupied: true,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "903",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "904",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "905",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "906",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "907",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "908",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "909",
      occupied: false,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "910",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "1001",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "1002",
      occupied: true,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "1003",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1004",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1005",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "1006",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "1007",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1008",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1009",
      occupied: false,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "1010",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "1101",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "1102",
      occupied: true,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "1103",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1104",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1105",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "1106",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "1107",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1108",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1109",
      occupied: false,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "1110",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "1201",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "1202",
      occupied: true,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "1203",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1204",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1205",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "1206",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "1207",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1208",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1209",
      occupied: false,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "1210",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "1301",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "1302",
      occupied: true,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "1303",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1304",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1305",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "1306",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "1307",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1308",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1309",
      occupied: false,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "1310",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "1401",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "1402",
      occupied: true,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "1403",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1404",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1405",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "1406",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "1407",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1408",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1409",
      occupied: false,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "1410",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "1501",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "1502",
      occupied: true,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "1503",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1504",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1505",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "1506",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "1507",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1508",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1509",
      occupied: false,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "1510",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "1601",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "1602",
      occupied: true,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "1603",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1604",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1605",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "1606",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "1607",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1608",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1609",
      occupied: false,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "1610",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "1701",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "1702",
      occupied: true,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "1703",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1704",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1705",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "1706",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "1707",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1708",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1709",
      occupied: false,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "1710",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "1801",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "1802",
      occupied: true,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "1803",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1804",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1805",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "1806",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "1807",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1808",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1809",
      occupied: false,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "1810",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "1901",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "1902",
      occupied: true,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "1903",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1904",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1905",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "1906",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "1907",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1908",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1909",
      occupied: false,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "1910",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "2001",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "2002",
      occupied: true,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "2003",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "2004",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "2005",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "2006",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "2007",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "2008",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "2009",
      occupied: false,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "2010",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "2101",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "2102",
      occupied: true,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "2103",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "2104",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "2105",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "2106",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "2107",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "2108",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "2109",
      occupied: false,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "2110",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "2201",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "2202",
      occupied: true,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "2203",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "2204",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "2205",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "2206",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "2207",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "2208",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "2209",
      occupied: false,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "2210",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "2301",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "2302",
      occupied: true,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "2303",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "2304",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "2305",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "2306",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "2307",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "2308",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "2309",
      occupied: false,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "2310",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "2401",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "2402",
      occupied: true,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "2403",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "2404",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "2405",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "2406",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "2407",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "2408",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "2409",
      occupied: false,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "2410",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "2501",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "2502",
      occupied: true,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "2503",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "2504",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "2505",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "2506",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "2507",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "2508",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "2509",
      occupied: false,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "2510",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "2601",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "2602",
      occupied: true,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "2603",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "2604",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "2605",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "2606",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "2607",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "2608",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "2609",
      occupied: false,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "2610",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "2701",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "2702",
      occupied: true,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "2703",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "2704",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "2705",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "2706",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "2707",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "2708",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "2709",
      occupied: false,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "2710",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
  ];
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
leadRouter.post("/lead-updates", async (req, res) => {
  const results = [];
  const dataTuPush = [];
  const csvFilePath = path.join(__dirname, "leads_pavan_19-12-24.csv");

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
        let startDate = parseDate(Leadreceivedon);
        let cycleStartDate = parseDate(leadAssignDate);
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

        let dataAnalyzer = dataAnalyzers.find((dt) =>
          dt.firstName
            ?.toLowerCase()
            ?.includes(anayl?.split(" ")[0]?.toLowerCase())
        )?._id;

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
          approvalStatus: taggingstatus?.toLowerCase(),
          approvalDate: cycleStartDate,
          approvalRemark: "approved",
          startDate,
          cycleStartDate,
          project: projs,
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

leadRouter.get("/ok", (req, res) => {
  // Online Javascript Editor for free
  // Write, Edit and Run your Javascript code using JS Online Compiler

  console.log("Try programiz.pro");

  const list = [
    { flatNo: "503", occupied: true, carpetArea: 0, sellableCarpetArea: 0 },
    {
      flatNo: "504",
      occupied: false,
      carpetArea: 0,
      sellableCarpetArea: 0,
    },
    { flatNo: "505", occupied: true, carpetArea: 0, sellableCarpetArea: 0 },
    { flatNo: "506", occupied: true, carpetArea: 0, sellableCarpetArea: 0 },
    {
      flatNo: "507",
      occupied: false,
      carpetArea: 0,
      sellableCarpetArea: 0,
    },
    {
      flatNo: "508",
      occupied: false,
      carpetArea: 0,
      sellableCarpetArea: 0,
    },
    {
      flatNo: "509",
      occupied: false,
      carpetArea: 0,
      sellableCarpetArea: 0,
    },
    {
      flatNo: "510",
      occupied: false,
      carpetArea: 0,
      sellableCarpetArea: 0,
    },
    {
      flatNo: "511",
      occupied: false,
      carpetArea: 0,
      sellableCarpetArea: 0,
    },
    {
      flatNo: "512",
      occupied: false,
      carpetArea: 0,
      sellableCarpetArea: 0,
    },
    {
      flatNo: "601",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "602",
      occupied: true,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "603",
      occupied: false,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "604",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "605",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "606",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "607",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "608",
      occupied: false,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "609",
      occupied: false,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "610",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "701",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "702",
      occupied: true,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "703",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "704",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "705",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "706",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "707",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "708",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "709",
      occupied: false,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "710",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "801",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "802",
      occupied: true,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "803",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "804",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "805",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "806",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "807",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "808",
      occupied: false,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "809",
      occupied: false,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "810",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "901",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "902",
      occupied: true,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "903",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "904",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "905",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "906",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "907",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "908",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "909",
      occupied: false,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "910",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "1001",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "1002",
      occupied: true,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "1003",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1004",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1005",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "1006",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "1007",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1008",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1009",
      occupied: false,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "1010",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "1101",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "1102",
      occupied: true,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "1103",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1104",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1105",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "1106",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "1107",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1108",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1109",
      occupied: false,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "1110",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "1201",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "1202",
      occupied: true,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "1203",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1204",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1205",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "1206",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "1207",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1208",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1209",
      occupied: false,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "1210",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "1301",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "1302",
      occupied: true,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "1303",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1304",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1305",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "1306",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "1307",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1308",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1309",
      occupied: false,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "1310",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "1401",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "1402",
      occupied: true,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "1403",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1404",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1405",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "1406",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "1407",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1408",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1409",
      occupied: false,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "1410",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "1501",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "1502",
      occupied: true,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "1503",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1504",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1505",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "1506",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "1507",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1508",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1509",
      occupied: false,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "1510",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "1601",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "1602",
      occupied: true,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "1603",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1604",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1605",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "1606",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "1607",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1608",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1609",
      occupied: false,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "1610",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "1701",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "1702",
      occupied: true,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "1703",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1704",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1705",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "1706",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "1707",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1708",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1709",
      occupied: false,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "1710",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "1801",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "1802",
      occupied: true,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "1803",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1804",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1805",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "1806",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "1807",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1808",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1809",
      occupied: false,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "1810",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "1901",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "1902",
      occupied: true,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "1903",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1904",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1905",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "1906",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "1907",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1908",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "1909",
      occupied: false,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "1910",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "2001",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "2002",
      occupied: true,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "2003",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "2004",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "2005",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "2006",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "2007",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "2008",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "2009",
      occupied: false,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "2010",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "2101",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "2102",
      occupied: true,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "2103",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "2104",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "2105",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "2106",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "2107",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "2108",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "2109",
      occupied: false,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "2110",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "2201",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "2202",
      occupied: true,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "2203",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "2204",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "2205",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "2206",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "2207",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "2208",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "2209",
      occupied: false,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "2210",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "2301",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "2302",
      occupied: true,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "2303",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "2304",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "2305",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "2306",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "2307",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "2308",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "2309",
      occupied: false,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "2310",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "2401",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "2402",
      occupied: true,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "2403",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "2404",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "2405",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "2406",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "2407",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "2408",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "2409",
      occupied: false,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "2410",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "2501",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "2502",
      occupied: true,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "2503",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "2504",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "2505",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "2506",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "2507",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "2508",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "2509",
      occupied: false,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "2510",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "2601",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "2602",
      occupied: true,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "2603",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "2604",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "2605",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "2606",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "2607",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "2608",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "2609",
      occupied: false,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "2610",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "2701",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
    {
      flatNo: "2702",
      occupied: true,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "2703",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "2704",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "2705",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "2706",
      occupied: false,
      carpetArea: 1391,
      sellableCarpetArea: 2295.15,
    },
    {
      flatNo: "2707",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "2708",
      occupied: true,
      carpetArea: 975,
      sellableCarpetArea: 1608.75,
    },
    {
      flatNo: "2709",
      occupied: false,
      carpetArea: 607,
      sellableCarpetArea: 1001.55,
    },
    {
      flatNo: "2710",
      occupied: true,
      carpetArea: 756,
      sellableCarpetArea: 1247.4,
    },
  ];
  function parseUnitNumber(unit) {
    // Split the unit string into floor and number based on the length of the unit
    const floor = Math.floor(unit / 100);

    const number = unit % 100; // Extract unit number by taking the remainder
    return { floor, number };
  }
  const ok = list.map((ele) => {
    const parsed = parseUnitNumber(parseInt(ele.flatNo));
    ele.floor = parsed.floor;
    ele.number = parsed.number;
    ele.sellableCarpetArea = Math.ceil(ele.sellableCarpetArea);
    if (ele.number === 2 || ele.number === 9) {
      ele.configuration = "2BHK";
    } else {
      ele.configuration = "3BHK";
    }
    ele.allInclusiveValue = 0;
    ele.type = "";
    return ele;
  });
  res.send(ok);
});

export default leadRouter;
