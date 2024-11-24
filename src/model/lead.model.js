import mongoose from "mongoose";
const emailFormat = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
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
  },
  recording: {
    type: String,
  },
  stage: {
    type: String,
  },
  status: {
    type: String,
  },
  siteVisit: {
    type: String,
  },
});
const cycleSchema = new mongoose.Schema({
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
    refrence: {
      firstName: { type: String, default: null },
      lastName: { type: String, default: null },
      email: {
        type: String,
        default: null,
      },
      address: { type: String, default: null },
      countryCode: { type: String, default: "+91" },
      phoneNumber: { type: Number, default: null },
    },
    channelPartner: {
      type: String,
      ref: "channelPartners",
      default: null,
    },
    dataAnalyser: {
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
      // enum: ["Pending", "Rejected", "Approved"],
    },
    status: {
      type: String,
      default: "Pending",
    },
    interestedStatus: {
      type: String,
      default: "Cold",
      enum: ["Cold", "Hot", "Warm"],
    },
    cycle: {
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
    },
    approvalStage: {
      status: {
        type: String,
        required: true,
        default: null,
      },
      date: {
        type: Date,
        required: true,
        default: null,
      },
      remark: {
        type: String,
        required: true,
        default: null,
      },
    },
    followupStage: {
      status: {
        type: String,
        required: true,
        default: null,
      },
      date: {
        type: Date,
        required: true,
        default: null,
      },
      attendedBy: {
        type: String,
        ref: "employees",
        default: null,
      },
      remark: {
        type: String,
        required: true,
        default: null,
      },
    },
    visitStage: {
      status: {
        type: String,
        required: true,
        default: null,
      },
      date: {
        type: Date,
        required: true,
        default: null,
      },
      attendedBy: {
        type: String,
        ref: "employees",
        default: null,
      },
      remark: {
        type: String,
        required: true,
        default: null,
      },
    },
    revisitStage: {
      status: {
        type: String,
        required: true,
        default: null,
      },
      date: {
        type: Date,
        required: true,
        default: null,
      },
      attendedBy: {
        type: String,
        ref: "employees",
        default: null,
      },
      remark: {
        type: String,
        required: true,
        default: null,
      },
    },
    taggingOverStage: {
      status: {
        type: String,
        required: true,
        default: null,
      },
      date: {
        type: Date,
        required: true,
        default: null,
      },
      remark: {
        type: String,
        required: true,
        default: null,
      },
    },
    cycleHistory: [cycleSchema],
    callHistory: [callHistorySchema],
    viewedBy: [
      {
        employee: {
          type: String,
          ref: "employees",
          required: true,
        },
        viewedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    approvalHistory: [
      {
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
      },
    ],
    updateHistory: [
      {
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
      },
    ],
  },
  { timestamps: true }
);

const leadModel = mongoose.model("leads", leadSchema, "leads");
export default leadModel;
