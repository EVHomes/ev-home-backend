import { Router } from "express";
import { assignTask, getTask } from "../../controller/task.controller.js";
import { authenticateToken } from "../../middleware/auth.middleware.js";
const taskRouter = Router();

taskRouter.get("/task/:id", authenticateToken, getTask);
taskRouter.post("/assign-task/:id", authenticateToken, assignTask);

export default taskRouter;
