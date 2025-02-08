import mongoose from "mongoose";
const emailFormat = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const applicantSchema = new mongoose.Schema({
  firstName: { type: String, default: null },
  lastName: { type: String, default: null },
  address: { type: String, default: null },
  countryCode: { type: String, default: "+91" },
  phoneNumber: { type: Number, default: null },
  email: {
    type: String,
    default: null,
    // validate: {
    //   validator: function (value) {
    //     return emailFormat.test(value);
    //   },
    //   message: (props) => `${props.value} is not a valid email.`,
    // },
  },
  kyc: {
    verified: { type: Boolean, default: false },
    addhar: {
      verified: { type: Boolean, default: false },
      document: { type: String, default: null },
      remark: { type: String, default: "" },
      type: { type: String, default: "aadhar" },
    },
    pan: {
      verified: { type: Boolean, default: false },
      document: { type: String, default: null },
      remark: { type: String, default: "" },
      type: { type: String, default: "pan" },
    },
    other: {
      verified: { type: Boolean, default: false },
      document: { type: String, default: null },
      remark: { type: String, default: "" },
      type: { type: String, default: "" },
    },
  },
});

export const postSaleLeadSchema = new mongoose.Schema(
  {
    unitNo: { type: Number, required: true, default: null },
    floor: { type: Number, default: null },
    number: { type: Number, default: null },
    project: {
      type: String,
      required: true,
      default: null,
      ref: "ourProjects",
    },
    firstName: { type: String, required: true, default: null },
    lastName: { type: String, required: true, default: null },
    requirement: { type: String, default: null },
    countryCode: { type: String, default: "+91" },
    phoneNumber: { type: Number, default: null },
    address: { type: String, default: null },
    email: {
      type: String,
      default: null,

      // validate: {
      //   validator: function (value) {
      //     return emailFormat.test(value);
      //   },
      //   message: (props) => `${props.value} is not a valid email.`,
      // },
    },
    carpetArea: { type: Number, default: null },
    flatCost: { type: Number, default: null },
    closingManager: {
      type: String,
      ref: "employees",
      default: null,
    },
    postSaleExecutive: { type: String, ref: "employees", default: null },
    closingManagerTeam: [
      {
        type: String,
        ref: "employees",
        default: null,
      },
    ],
    applicants: [applicantSchema],
    bookingStatus: {
      type: { type: String, default: null },
      account: { type: String, default: null },
      amount: { type: String, default: null },
    },
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
        recieved: { type: String, default: "no" },
        value: { type: Number, default: null },
        percent: { type: Number, default: null },
        remark: { type: String, default: "" },
      },
      agreement: {
        prepared: { type: Boolean, default: false },
        handOver: {
          status: { type: String, default: "no" },
          document: { type: String, default: null },
          remark: { type: String, default: "" },
        },
        document: {
          verified: { type: Boolean, default: false },
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
    date: { type: Date, default: Date.now },
    allInclusiveAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
    cgstAmount: { type: Number, default: 0 },
    netAmount: { type: Number, default: 0 },
    stampDutyAmount: { type: Number, default: 0 },
    tdsAmount: { type: Number, default: 0 },
    flatCost: { type: Number, default: 0 },
    registrationDone: { type: Boolean, default: false},
  },
  { timestamps: true }
);

const postSaleLeadModel = mongoose.model(
  "postSaleLead",
  postSaleLeadSchema,
  "postSaleLeads"
);
export default postSaleLeadModel;
