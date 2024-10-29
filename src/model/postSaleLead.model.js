import mongoose from "mongoose";
const emailFormat = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const applicantSchema = new mongoose.Schema({
  firstName: { type: String, default: null },
  lastName: { type: String, default: null },
});

export const postSaleLeadSchema = new mongoose.Schema({
  unitNo: { type: String, required: true, default: null },
  project: { type: String, required: true, default: null },
  firstName: { type: String, required: true, default: null },
  lastName: { type: String, required: true, default: null },
  requirement: { type: String, default: null },
  countryCode: { type: String, default: "+91" },
  phoneNumber: { type: Number, required: true, default: null },
  address: { type: String, required: true, default: null },
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
  carpetArea: { type: String, default: null },
  flatCost: { type: Number, default: null },
  closingManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "employees",
    default: null,
  },
  closingManagerTeam: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employees",
      default: null,
    },
  ],
  bookingStatus: { type: String, default: null },
  applicants: [applicantSchema],
  preRegistrationCheckList: {
    tenPercentRecieved: {
      recieved: { type: String, default: "no" },
      value: { type: Number, default: null },
      percent: { type: Number, default: null },
      remark: { type: String, default: "" },
    },
    stampDuty: {
      recieved: { type: String, default: "no" },
      value: { type: Number, default: null },
      percent: { type: Number, default: null },
      remark: { type: String, default: "" },
    },
    gst: {
      recieved: { type: String, default: "no" },
      value: { type: Number, default: null },
      percent: { type: Number, default: null },
      remark: { type: String, default: "" },
    },
    noc: {
      recieved: { type: String, default: "no" },
      value: { type: Number, default: null },
      percent: { type: Number, default: null },
      remark: { type: String, default: "" },
    },
    tds: {
      recieved: { type: String, default: "no" },
      value: { type: Number, default: null },
      percent: { type: Number, default: null },
      remark: { type: String, default: "" },
    },
    legalCharges: {
      recieved: { type: String, default: "no" },
      value: { type: Number, default: null },
      percent: { type: Number, default: null },
      remark: { type: String, default: "" },
    },
    kyc: {
      addhar: {
        verified: { type: Boolean, default: false },
        document: { type: String, default: null },
        remark: { type: String, default: "" },
      },
      pan: {
        verified: { type: Boolean, default: false },
        document: { type: String, default: null },
        remark: { type: String, default: "" },
      },
      other: {
        verified: { type: Boolean, default: false },
        document: { type: String, default: null },
        remark: { type: String, default: "" },
      },
    },
    aggrement: {
      prepared: { type: Boolean, default: false },
      handOver: {
        status: { type: String, default: "no" },
        document: { type: String, default: null },
        remark: { type: String, default: "" },
      },
      document: {
        verified: { type: String, default: false },
        document: { type: String, default: null },
        remark: { type: String, default: "" },
      },
    },
  },
  disbursementRecord: [
    {
      value: { type: Number, default: null },
      percent: { type: Number, default: null },
      recievedAmount: { type: Number, default: null },
      gst: { type: Number, default: null },
      remark: { type: String, default: "" },
    },
  ],
});

const postSaleLeadModel = mongoose.model(
  "postSaleLead",
  postSaleLeadSchema,
  "postSaleLeads"
);
export default postSaleLeadModel;
