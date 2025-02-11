import mongoose from "mongoose";
const dateOfAmtReceive = /^\d{4}-\d{2}-\d{2}$/;
export const paymentSchema = new mongoose.Schema(
  {
    projects: {
      type: String,
      required: true,
      default: null,
      ref: "ourProjects",
    },
    slab: {
      type: String,
      required: true,
      default: null,
      ref: "Slab",
    },
    customerName: {
      type: String,
    },
    carpetArea: {
      type: String,
      default: "",
    },
    address1: {
      type: String,
      default: "",
    },
    address2: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    pincode: {
      type: Number,
      default: 0,
    },
    countryCode: { type: String, default: "+91" },
    phoneNumber: {
      type: Number,
      default: 0,
    },
    dateOfAmtReceive: {
      type: String,
      default: "1999-01-01",
    },
    receiptNo: {
      type: String,
      default: "",
    },
    account: {
      type: String,
      default: "",
    },
    paymentMode: {
      type: String,
      default: "",
    },
    transactionId: {
      type: String,
    },
    flatNo: { type: String, required: true, default: null },
    amtReceived: {
      type: Number,
      required: true,
    },
    allinclusiveamt: {
      type: Number,
      required: true,
    },
    bookingAmt: {
      type: Number,
      required: true,
    },
    stampDuty: {
      type: Number,
      required: true,
    },
    tds: { type: Number },
    cgst: { type: Number, required: true },
  },
  { timestamps: true }
);

const paymentModel = mongoose.model("payments", paymentSchema, "payments");
export default paymentModel;
