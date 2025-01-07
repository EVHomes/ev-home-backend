import { Router } from "express";
import {
  assignTask,
  getTask,
  getTaskByid,
  getTaskReminders,
  getTaskTeam,
  updateFeedback,
  updateTask,
  updateTaskReminder,
} from "../../controller/task.controller.js";
import { authenticateToken } from "../../middleware/auth.middleware.js";
const taskRouter = Router();

taskRouter.get("/task/:id", getTask);
taskRouter.get("/task-reminders/:id", getTaskReminders);
taskRouter.get("/task-by-id/:id", getTaskByid);
taskRouter.get("/task-team/:id", getTaskTeam);
taskRouter.post("/assign-task/:id", authenticateToken, assignTask);
taskRouter.post("/update-task/:id", authenticateToken, updateTask);
taskRouter.post(
  "/update-task-reminder/:id",
  authenticateToken,
  updateTaskReminder
);
taskRouter.post("/update-feedback", authenticateToken, updateFeedback);

export default taskRouter;
