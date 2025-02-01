import mongoose from "mongoose";

export const leaveRequestSchema = new mongoose.Schema(
  {
    leaveType: {
      type: String,
      required: true,
      enum: [
        "compensatory_off",
        "paid_leave",
        "unpaid_leave",
        "sick_leave",
        "casual_leave",
      ],
    },
    appliedOn: {
      type: Date,
      required: true,
    },
    approveOn: {
      type: Date,
      default: null,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    numberOfDays: {
      type: Number,
      required: true,
    },
    leaveReason: {
      type: String,
      required: true,
    },
    approveReason: {
      type: String,
      default: null,
    },
    leaveStatus: {
      type: String,
      required: true,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    applicant: {
      type: String,
      ref: "employees",
      required: true,
    },
    approveBy: {
      type: String,
      ref: "employees",
      default: null,
    },
    reportingTo: {
      type: String,
      ref: "employees",
      required: true,
    },
    attachedFile: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const leaveRequestModel = mongoose.model(
  "leaveRequest",
  leaveRequestSchema,
  "leaveRequests"
);
export default leaveRequestModel;
