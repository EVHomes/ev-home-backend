import express from "express";
import cors from "cors";
import "dotenv/config";
import config from "./config/config.js";
import connectDatabase from "./config/database.js";
import router from "./routes/router.js";

connectDatabase();
const app = express();

app.use(express.json());
app.use(cors());
app.use(router);

app.listen(config.PORT, () => console.log("listening on port " + config.PORT));

export default app;
