import { Router } from "express";
import{
    getDepartment,
    getDepartmentById,
    addDepartment,
    updateDepartment,
    deleteDepartment,
}from "../../controller/department.controller.js";

const deptRouter=Router();
deptRouter.get("/department",getDepartment);
deptRouter.get("/department/:id",getDepartmentById);
deptRouter.post("/department-add",addDepartment);
deptRouter.post("/department-update/:id",updateDepartment);
deptRouter.delete("/department/:id",deleteDepartment);

export default deptRouter;
