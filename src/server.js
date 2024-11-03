import express from "express";
import cors from "cors";
import "dotenv/config";
import config from "./config/config.js";
import connectDatabase from "./config/database.js";
import router from "./routes/router.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { hostnameCheck } from "./utils/helper.js";
import leadModel from "./model/lead.model.js";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";
import employeeModel from "./model/employee.model.js";
import designationModel from "./model/designation.model.js";
import departmentModel from "./model/department.model.js";
import divisionModel from "./model/division.model.js";
import siteVisitModel from "./model/siteVisitForm.model.js";

// Manually define __dirname for ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const empJsonPath = path.resolve(__dirname, "./ev_homes_main.employees2.json");
export const svisitJsonPath = path.resolve(__dirname, "./sitevisit.json");
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
//671d1153458ef20177d463e4
app.get("/lead-fix", async (req, res) => {
  try {
    const resp = await leadModel.findById("671d1153458ef20177d463e4");
    resp.updateHistory[0].employee = "ev201-aktarul-desg-app-developer";
    resp.approvalHistory[0].employee = "ev201-aktarul-desg-app-developer";
    resp.save();
    res.json(resp);
  } catch (error) {
    res.send(error);
  }
});

app.get("/test2", async (req, res) => {
  try {
    const jsonData = JSON.parse(await fs.readFile(empJsonPath, "utf8"));
    const jsonVisitsData = JSON.parse(await fs.readFile(svisitJsonPath, "utf8"));
    // const findeVIsits = await siteVisitModel.find();
    console.log(jsonData.length || 0);
    console.log(jsonVisitsData.length || 0);
    console.log(typeof jsonData);
    console.log(typeof jsonVisitsData);
    if (jsonData.length <= 0) return res.json("no Data");
    if (jsonVisitsData.length <= 0) return res.json("no  jsonVisitsData Data");
    console.log("pass no data");
    // const newJson2 = jsonVisitsData.map((ele) => {
    //   const cls = jsonData.find((fle) => fle.oid === ele?.closingManager) || null;
    //   const atd = jsonData.find((fle) => fle.oid === ele?.attendedBy) || null;
    //   ele.closingManager = cls?._id;
    //   ele.attendedBy = atd?._id;
    //   return ele;
    // });
    // const newJson2 = jsonData.map((ele) => {
    //   ele.createdAt = ele.createdAt.$date;
    //   ele.updatedAt = ele.updatedAt.$date;

    //   return ele;
    // });
    // const prom = findeVIsits.map(async (sVit) => {
    //   const closM = jsonData.find((ele) => ele.oid === sVit?.closingManager) || null;
    //   const attendM = jsonData.find((ele) => ele.oid === sVit?.attendedBy) || null;

    //   sVit.closingManager = closM;
    //   sVit.attendedBy = attendM;

    //   // If you want to update the records in the database, uncomment and adjust the following line:
    //   // await sVit.updateOne({ closingManager: closM, attendedBy: attendM });

    //   return sVit;
    // });

    // const got = await Promise.all(prom);
    await siteVisitModel.insertMany(jsonVisitsData);
    res.json(newJson2);
  } catch (error) {
    res.send(error);
  }
});
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
