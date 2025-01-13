import mongoose from "mongoose";
import employeeModel from "../model/employee.model.js";

export const shiftSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    shiftName: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    timeIn: {
      type: String,
      required: true,
    },
    timeOut: {
      type: String,
      required: true,
    },
    multiTimeInOut: {
      type: Boolean,
    },
    workingHours: {
      type: Number,
      required: true,
    },
    graceTime: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      default: "Active",
    },
    employees: [
      {
        type: String,
        ref: "employees", // Reference to the employee model
      },
    ],
  },
  { timestamps: true }
);

const shiftModel = mongoose.model("Shift", shiftSchema, "shifts");
export default shiftModel;
