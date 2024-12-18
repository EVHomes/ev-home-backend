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
    const response = await axios.get(
      "https://api.evhomes.tech/lead-trigger-cycle-change"
    );
    const list = response?.data?.data.map((ele) => ele?._id) ?? [];
    await triggerHistoryModel.create({
      date: new Date(),
      changes: list,
      totalTrigger: response?.data?.totalItem ?? 0,
      message: response?.data?.message ?? "",
    });
    console.log("API Response:", response.data);
  } catch (error) {
    console.error("Error making API call:", error.message);
  }
});

app.listen(config.PORT, () => console.log("listening on port " + config.PORT));

export default app;
