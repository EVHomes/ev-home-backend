import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    assignTo: {
      type: String,
      required: true,
      ref: "employees",
    },
    assignBy: {
      type: String,
      required: true,
      ref: "employees",
    },
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      ref: "leads",
    },
    visit: {
      type: String,
      default: null,
      ref: "siteVisits",
    },
    booking: {
      type: String,
      default: null,
      ref: "postSaleLead",
    },
    name: { type: String, required: true, default: null },
    details: { type: String, required: true, default: null },
    type: { type: String, required: true, default: null },
    completed: { type: Boolean, default: false },
    completedDate: { type: Date, default: null },
    deadline: { type: Date, default: null },
  },
  { timestamps: true }
);

const taskModel = mongoose.model("task", taskSchema, "tasks");
export default taskModel;
