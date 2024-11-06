import express from "express";
import cors from "cors";
import "dotenv/config";
import config from "./config/config.js";
import connectDatabase from "./config/database.js";
import router from "./routes/router.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { hostnameCheck } from "./utils/helper.js";
// import leadModel from "./model/lead.model.js";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
import csv from "csv-parser";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const flatsJsonPath = path.resolve(
  __dirname,
  "./Avni_Price_sheet_2.csv"
);

const csvToJson = async (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (error) => reject(error));
  });
};

// import employeeModel from "./model/employee.model.js";
// import designationModel from "./model/designation.model.js";
// import departmentModel from "./model/department.model.js";
// import divisionModel from "./model/division.model.js";
// import siteVisitModel from "./model/siteVisitForm.model.js";

// // Manually define __dirname for ES6 modules
// export const empJsonPath = path.resolve(__dirname, "./ev_homes_main.employees2.json");
// export const leadsJsonPath = path.resolve(__dirname, "./leads.json");
// export const desgJsonPath = path.resolve(__dirname, "./ev_homes_main.designations.json");
// export const deptJsonPath = path.resolve(__dirname, "./ev_homes_main.departments.json");
// export const divJsonPath = path.resolve(__dirname, "./ev_homes_main.divisions.json");

connectDatabase();

const app = express();
app.use(hostnameCheck);

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.set("view engine", "ejs");

app.use(cors());
app.use(router);

app.get("/test22323", async (req, res) => {
  try {
    const jsonData = await csvToJson(flatsJsonPath);
    const tesp = jsonData.map((ele) => {
      ele.flatNo = ele["\ufeffflatNo"];
      const floor = Math.floor(ele.flatNo / 100);
      const number = ele.flatNo % 100;
      ele.floor = floor;
      ele.number = number;
      return ele;
    });
    // console.log("CSV Data:", JSON.stringify(jsonData, null, 2));
    res.json(tesp);
  } catch (error) {
    console.error("Error reading CSV:", error);
    res.status(500).json({ error: "Failed to parse CSV file" });
  }
});

//671d1153458ef20177d463e4
// app.get("/lead-fix", async (req, res) => {
//   try {
//     const resp = await leadModel.findById("671d1153458ef20177d463e4");
//     resp.updateHistory[0].employee = "ev201-aktarul-desg-app-developer";
//     resp.approvalHistory[0].employee = "ev201-aktarul-desg-app-developer";
//     resp.save();
//     res.json(resp);
//   } catch (error) {
//     res.send(error);
//   }
// });

// app.get("/test2", async (req, res) => {
//   try {
//     const jsonData = JSON.parse(await fs.readFile(empJsonPath, "utf8"));
//     const leadsData = JSON.parse(await fs.readFile(leadsJsonPath, "utf8"));
//     // const findeVIsits = await leadModel.find();
//     console.log(jsonData.length || 0);
//     console.log(leadsData.length || 0);
//     console.log(typeof jsonData);
//     console.log(typeof leadsData);
//     if (jsonData.length <= 0) return res.json("no Data");
//     if (leadsData.length <= 0) return res.json("no  leadsData Data");
//     console.log("pass no data");
//     await leadModel.insertMany(leadsData);
//     // const newJson2 = leadsData.map((ele) => {
//     //   const tl = jsonData.find((fle) => fle.oid === ele?.teamLeader) || null;
//     //   const prex = jsonData.find((fle) => fle.oid === ele?.preSalesExecutive) || null;
//     //   const dta = jsonData.find((fle) => fle.oid === ele?.dataAnalyser) || null;
//     //   ele.teamLeader = tl?._id;
//     //   ele.preSalesExecutive = prex?._id;
//     //   ele.dataAnalyser = dta?._id;
//     //   ele.callHistory = ele.callHistory.map((cle) => {
//     //     const cll2 = jsonData.find((fle) => fle.oid === cle?.caller) || null;

//     //     cle.caller = cll2?._id;
//     //     return cle;
//     //   });
//     //   ele.approvalHistory = ele.approvalHistory.map((cle) => {
//     //     const cll2 = jsonData.find((fle) => fle.oid === cle?.employee) || null;

//     //     cle.employee = cll2?._id;
//     //     return cle;
//     //   });
//     //   ele.updateHistory = ele.updateHistory.map((cle) => {
//     //     const cll2 = jsonData.find((fle) => fle.oid === cle?.employee) || null;

//     //     cle.employee = cll2?._id;
//     //     return cle;
//     //   });
//     //   ele.viewedBy = ele.viewedBy.map((cle) => {
//     //     const cll2 = jsonData.find((fle) => fle.oid === cle?.employee) || null;

//     //     cle.employee = cll2?._id;
//     //     return cle;
//     //   });

//     //   return ele;
//     // });
//     // const newJson2 = jsonData.map((ele) => {
//     //   ele.createdAt = ele.createdAt.$date;
//     //   ele.updatedAt = ele.updatedAt.$date;

//     //   return ele;
//     // });
//     // const prom = findeVIsits.map(async (sVit) => {
//     //   const closM = jsonData.find((ele) => ele.oid === sVit?.closingManager) || null;
//     //   const attendM = jsonData.find((ele) => ele.oid === sVit?.attendedBy) || null;

//     //   sVit.closingManager = closM;
//     //   sVit.attendedBy = attendM;

//     //   // If you want to update the records in the database, uncomment and adjust the following line:
//     //   // await sVit.updateOne({ closingManager: closM, attendedBy: attendM });

//     //   return sVit;
//     // });

//     // const got = await Promise.all(prom);
//     // await siteVisitModel.insertMany(jsonVisitsData);
//     res.json(leadsData);
//   } catch (error) {
//     res.send(error);
//   }
// });
// app.get("/test2", async (req, res) => {
//   try {
//     const jsonData = JSON.parse(await fs.readFile(divJsonPath, "utf8"));
//     console.log(jsonData.length || 0);
//     console.log(typeof jsonData);
//     if (jsonData.length <= 0) return res.json("no Data");
//     console.log("pass no data");
//     // const newJson2 = jsonData.map((ele) => {
//     //   ele.createdAt = ele.createdAt.$date;
//     //   ele.updatedAt = ele.updatedAt.$date;

//     //   return ele;
//     // });
//     await divisionModel.insertMany(jsonData);
//     // await departmentModel.insertMany(jsonData);
//     // await designationModel.insertMany(jsonData);
//     res.json(jsonData);
//   } catch (error) {
//     res.send(error);
//   }
// });

function filterDotDash(str) {
  let str2 = str?.replace(".", "")?.replace("-", "")?.replace(",", "");
  if (str2 == "") return "";
  return str2.replace(/\s+/g, "");
}

app.use(notFound);
app.use(errorHandler);

app.listen(config.PORT, () => console.log("listening on port " + config.PORT));

export default app;
