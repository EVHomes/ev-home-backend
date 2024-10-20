import mongoose from "mongoose";
const emailFormat = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const callHistorySchema = new mongoose.Schema({
  caller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "employees", // Reference to the employee making the call
    required: true,
  },
  callDate: {
    type: Date,
    default: Date.now,
  },
  remarks: {
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
});

export const leadSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return emailFormat.test(value);
        },
        message: (props) => `${props.value} is not a valid email.`,
      },
    },
    project: [
      {
        type: String,
        // type: mongoose.Schema.Types.ObjectId,
        // ref: "ourProjects",
        required: true,
      },
    ],
    requirement: [
      {
        type: String,
        // type: mongoose.Schema.Types.ObjectId,
        // ref: "ourProjects",
        required: true,
      },
    ],
    firstName: { type: String, required: true, default: null },
    lastName: { type: String, required: true, default: null },
    address: { type: String, default: null },
    channelPartner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "channelPartners",
      default: null,
    },
    dataAnalyser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employees",
      default: null,
    },
    teamLeader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employees",
      default: null,
    },
    preSalesExecutive: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employees",
      default: null,
    },
    countryCode: { type: String, default: "+91" },
    phoneNumber: { type: Number, required: true, default: null },
    altPhoneNumber: { type: Number, default: null },
    remark: { type: String, default: null },
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
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Rejected", "Approved"],
    },
    interestedStatus: {
      type: String,
      default: "Cold",
      enum: ["Cold", "Hot", "Warm"],
    },
    callHistory: [callHistorySchema],
    viewedBy: [
      {
        employeeId: {
          type: mongoose.Schema.Types.ObjectId,
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
          type: mongoose.Schema.Types.ObjectId,
          ref: "employees",
          required: true,
        },
        approvedAt: {
          type: Date,
          default: Date.now,
        },
        remarks: { type: String, default: null },
      },
    ],
    updateHistory: [
      {
        employee: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "employees",
          required: true,
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
        changes: { type: String, required: true }, // Description of changes made
      },
    ],
  },
  { timestamps: true }
);

const leadModel = mongoose.model("leads", leadSchema, "leads");
export default leadModel;
