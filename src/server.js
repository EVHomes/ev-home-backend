import express from "express";
import cors from "cors";
import "dotenv/config";
import config from "./config/config.js";
import connectDatabase from "./config/database.js";
import router from "./routes/router.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { hostnameCheck } from "./utils/helper.js";
import cron from "node-cron";
import axios from "axios";
import triggerHistoryModel from "./model/triggerLog.model.js";
import { triggerCycleChangeFunction } from "./controller/lead.controller.js";
import {
  insertDailyAttendance,
  markPendingDailyAttendance,
} from "./routes/attendance/attendanceRouter.js";
connectDatabase();

const app = express();
app.use(hostnameCheck);

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.set("view engine", "ejs");

app.use(cors());
app.use(router);

app.use(notFound);
app.use(errorHandler);

// Schedule a task to run at 9 AM daily and change cycle
cron.schedule("0 9 * * *", async () => {
  try {
    // Make the API call
    // const response = await axios.get(
    //   "https://api.evhomes.tech/lead-trigger-cycle-change"
    // );
    const response = await triggerCycleChangeFunction();

    await triggerHistoryModel.create({
      date: new Date(),
      changes: response?.changes ?? [],
      changesString: response?.changesString ?? "",
      totalTrigger: response?.total ?? 0,
      message: response?.message ?? "",
    });
  } catch (error) {
    console.error("Error making API call:", error.message);
  }
});

// Trigger at 5:30 AM
cron.schedule("30 5 * * *", async () => {
  console.log("Triggered at 5:30 AM local time");
  await insertDailyAttendance();
});

// Trigger at 11:59 PM
cron.schedule("59 23 * * *", async () => {
  console.log("Triggered at 11:59 PM local time");
  await markPendingDailyAttendance();
});

app.listen(config.PORT, () => console.log("listening on port " + config.PORT));

export default app;
