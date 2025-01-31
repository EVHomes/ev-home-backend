import mongoose from "mongoose";
export const weekoffSchema = new mongoose.Schema({
  weekoffDate: {
    type: Date,
    required: true,
  },
  appliedOn: {
    type: Date,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  aprovereason: {
    type: String,

    default: "pending",
  },
  weekoffstatus: {
    type: String,

    default: "pending",
  },
  applyby: {
    type: String,
    ref: "employees",
    default: null,
  },
  reportingto: {
    type: String,
    ref: "employees",
    default: null,
  },
});

const weekoffModel = mongoose.model("weekoff", weekoffSchema, "weekoff");
export default weekoffModel;
