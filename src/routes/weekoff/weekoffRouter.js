import { Router } from "express";
import { authenticateToken } from "../../middleware/auth.middleware.js";
import { addweekoff } from "../../controller/weekoff.controller.js";
const weekoffRouter =Router();
// weekoffRouter.get("/weekoff",getweekoff);
weekoffRouter.post("/add-weekoff",addweekoff);
export default weekoffRouter