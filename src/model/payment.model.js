import mongoose from "mongoose";
import { stringify } from "uuid";
const dateOfAmtReceive = /^\d{4}-\d{2}-\d{2}$/;
export const paymentSchema = new mongoose.Schema({
  projects: {
    type: String,
    required: true,
    default: null,
    ref: "ourProjects",
  },
  customerName: {
    type: String,
    required: true,
  },
  carpetArea: {
    type: String,
    required: true,
  },
  address1: {
    type: String,
  },
  address2: {
    type: String,
  },
  city: {
    type: String,
  },
  pincode: {
    type: Number,
  },
  countryCode: { type: String, default: "+91" },
  phoneNumber: {
    type: Number,
    required: true,
  },

  dateOfAmtReceive: {
    type: String,
    required: true,
    default: "1999-01-01",
    validate: {
      validator: function (value) {
        // Check if the date matches the YYYY-MM-DD format
        return dateOfAmtReceive.test(value);
      },
      message: (props) =>
        `${props.value} is not a valid date of birth. Use YYYY-MM-DD format.`,
    },
  },
  receiptNo: {
    type: String,
    required: true,
  },
  account: {
    type: String,
    // enum: ["ICICI-22390", "ICICI-22186"],
  },
  paymentMode: {
    type: String,
    // enum: ["Online", "Cheque"],
  },
  transactionId:{
    type:String,
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
  tds: { type: Number,
  },
  cgst: { type: Number, required: true },

},  { timestamps: true });

const paymentModel = mongoose.model("payments", paymentSchema, "payments");
export default paymentModel;
