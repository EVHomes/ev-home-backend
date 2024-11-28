import mongoose from "mongoose";
// const emailFormat = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const cycle = {
  stage: {
    type: String,
    required: true,
    default: null,
  },
  currentOrder: {
    type: Number,
    required: true,
    default: 0,
  },
  teamLeader: {
    type: String,
    ref: "employees",
    default: null,
  },
  startDate: {
    type: Date,
    required: true,
    default: null,
  },
  validTill: {
    type: Date,
    required: true,
    default: null,
  },
  nextTeamLeader: {
    type: String,
    ref: "employees",
    default: null,
  },
};
const cycleSchema = new mongoose.Schema({
  ...cycle,
});

const approvalSchema = new mongoose.Schema({
  employee: {
    type: String,
    ref: "employees",
    required: true,
  },
  approvedAt: {
    type: Date,
    default: Date.now,
  },
  remark: { type: String, default: null },
});
const updateSchema = new mongoose.Schema({
  employee: {
    type: String,
    ref: "employees",
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  changes: { type: String, required: true },
  remark: { type: String, default: null },
});
const callHistorySchema = new mongoose.Schema({
  caller: {
    type: String,
    ref: "employees",
    required: true,
  },
  callDate: {
    type: Date,
    default: Date.now,
  },
  remark: {
    type: String,
    default: null,
  },
  feedback: {
    type: String,
    default: null,
  },
  document: {
    type: String,
    default: null,
  },
  recording: {
    type: String,
    default: null,
  },
  stage: {
    type: String,
    default: null,
  },
});

export const leadSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      default: null,
    },
    project: [
      {
        type: String,
        ref: "ourProjects",
        required: true,
      },
    ],
    requirement: [
      {
        type: String,
        required: true,
      },
    ],
    firstName: { type: String, default: null },
    lastName: { type: String, default: null },
    address: { type: String, default: null },
    leadType: { type: String, default: "channel-partner" },
    reference: {
      type: String,
      ref: "reference",
      default: null,
    },
    channelPartner: {
      type: String,
      ref: "channelPartners",
      default: null,
    },
    dataAnalyzer: {
      type: String,
      ref: "employees",
      default: null,
    },
    teamLeader: {
      type: String,
      ref: "employees",
      default: null,
    },
    preSalesExecutive: {
      type: String,
      ref: "employees",
      default: null,
    },
    salesExecutive: {
      type: String,
      ref: "employees",
      default: null,
    },
    salesManager: {
      type: String,
      ref: "employees",
      default: null,
    },
    countryCode: { type: String, default: "+91" },
    phoneNumber: { type: Number, default: null },
    altPhoneNumber: { type: Number, default: null },
    remark: { type: String, default: null },
    leadType: { type: String, default: null },
    stage: { type: String, default: "approval" },
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    validTill: {
      type: Date,
      required: true,
      default: function () {
        let startDate = this.startDate || Date.now();
        let validTillDate = new Date(startDate);
        validTillDate.setMonth(validTillDate.getMonth() + 2);
        return validTillDate;
      },
    },
    previousValidTill: {
      type: Date,
      default: null,
    },
    approvalStatus: {
      type: String,
      default: "Pending",
    },
    approvalRemark: {
      type: String,
      default: "",
    },
    approvalDate: {
      type: Date,
      default: null,
    },
    visitStatus: {
      type: String,
      default: "pending",
    },
    visitRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "siteVisits",
      default: null,
    },
    revisitStatus: {
      type: String,
      default: "pending",
    },
    revisitRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "siteVisits",
      default: null,
    },
    bookingStatus: {
      type: String,
      default: "pending",
    },
    bookingRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "booking",
      default: null,
    },
    interestedStatus: {
      type: String,
      default: "Cold",
    },
    clientStatus: {
      type: String,
      default: "none",
    },
    clientRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "clients",
      default: null,
    },
    status: {
      type: String,
      default: "Pending",
    },
    cycle: cycle,
    approvalHistory: [approvalSchema],
    updateHistory: [updateSchema],
    cycleHistory: [cycleSchema],
    callHistory: [callHistorySchema],
  },
  { timestamps: true }
);

const leadModel = mongoose.model("leads", leadSchema, "leads");
export default leadModel;
