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
  aproveReason: {
    type: String,
    default: "pending",
  },
  weekoffStatus: {
    type: String,
    default: "pending",
  },
  applyBy: {
    type: String,
    ref: "employees",
    default: null,
  },
  reportingTo: {
    type: String,
    ref: "employees",
    default: null,
  },
});

const weekoffModel = mongoose.model("weekoff", weekoffSchema, "weekoff");
export default weekoffModel;
