import mongoose from "mongoose";
const emailFormat = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const refrenceSchema = new mongoose.Schema({
  firstName: { type: String, required: true, default: null },
  lastName: { type: String, required: true, default: null },
  email: {
    type: String,
    default: null,
  },
  isVerifiedPhone: { type: Boolean, default: false },
  isVerifiedEmail: { type: Boolean, default: false },
  phoneNumber: { type: Number, required: true, unique: true },
  countryCode: { type: Number, default: "+91" },
  altPhoneNumber: { type: Number, required: false },
  address: { type: String, required: false, default: null },
  role: {
    type: String,
    default: "reference",
    enum: ["employee", "channel-partner", "customer", "reference"],
  },
});

const refrenceModel = mongoose.model("reference", refrenceSchema, "references");
export default refrenceModel;
