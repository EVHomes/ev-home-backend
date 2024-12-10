import { Router } from "express";
import {
  assignTask,
  getTask,
  updateTask,
} from "../../controller/task.controller.js";
import { authenticateToken } from "../../middleware/auth.middleware.js";
const taskRouter = Router();

taskRouter.get("/task/:id", getTask);
taskRouter.post("/assign-task/:id", authenticateToken, assignTask);
taskRouter.post("/update-task/:id", authenticateToken, updateTask);

export default taskRouter;
