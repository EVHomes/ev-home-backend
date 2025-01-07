import { Router } from "express";
import {
  assignTask,
  getTask,
  getTaskTeam,
  updateFeedback,
  updateTask,
} from "../../controller/task.controller.js";
import { authenticateToken } from "../../middleware/auth.middleware.js";
const taskRouter = Router();

taskRouter.get("/task/:id", getTask);
taskRouter.get("/task-team/:id", getTaskTeam);
taskRouter.post("/assign-task/:id", authenticateToken, assignTask);
taskRouter.post("/update-task/:id", authenticateToken, updateTask);
taskRouter.post("/update-feedback", authenticateToken, updateFeedback);

export default taskRouter;
