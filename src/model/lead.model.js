import mongoose from "mongoose";
const dateOfBirthFormat = /^\d{4}-\d{2}-\d{2}$/;
const emailFormat = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordFormat = /^\d+$/;

export const leadSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (value) {
          return emailFormat.test(value);
        },
        message: (props) => `${props.value} is not a valid email.`,
      },
    },
    firstName: { type: String, required: true, default: null },
    lastName: { type: String, required: true, default: null },
    address: { type: String, default: null },
    channelPartner: { type: String, ref: "channelPartners", default: null },
    dataAnalyser: { type: String, ref: "employees", default: null },
    teamLeader: { type: String, ref: "employees", default: null },
    preSalesExecutive: { type: String, ref: "employees", default: null },
    countryCode: { type: String, default: "+91" },
    phoneNumber: { type: Number, required: true, default: null, unique: true },
    altPhoneNumber: { type: Number, required: true, default: null },
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending, Rejected, Approved"],
    },
    interestedStatus: {
      type: String,
      default: "Cold",
      enum: ["Cold, Hot, Warm"],
    },
  },
  { timestamps: true }
);

const leadModel = mongoose.model("leads", leadSchema, "leads");
export default leadModel;
