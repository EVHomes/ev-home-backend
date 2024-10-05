import express from "express";
import cors from "cors";
import "dotenv/config";
import config from "./config/config.js";

const app = express();

app.use(express.json());
app.use(express.json());
app.use(cors());

app.listen(config.PORT, () => console.log("listening on port " + config.PORT));

export default app;
