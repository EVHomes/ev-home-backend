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
    assignDate: { type: Date, default: Date.now() },
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
    name: { type: String, default: "" },
    details: { type: String, default: "" },
    remark: { type: String, default: "" },
    type: { type: String, required: true, default: null },
    completed: { type: Boolean, default: false },
    completedDate: { type: Date, default: null },
    deadline: { type: Date, default: null },
    reminderDate: { type: Date, default: null },
    remindMe: { type: Boolean, default: false },
    reminderDescription: { type: String, default: null },
  },
  { timestamps: true }
);

const taskModel = mongoose.model("task", taskSchema, "tasks");
export default taskModel;
