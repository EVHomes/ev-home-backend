import mongoose from "mongoose";

export const channelPartnerSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, default: null },
    lastName: { type: String, default: null },
    gender: { type: String, required: true },
    dateOfBirth: { type: String, required: true, default: "1999-01-01" },
    firmName: { type: String, required: true, default: null },
    homeAddress: { type: String, required: true, default: null },
    firmAddress: { type: String, required: true, default: null },
    countryCode: { type: String, required: true, unique: true, default: "+91" },
    phoneNumber: { type: Number, required: true, default: null },
    haveReraRegistration: { type: Boolean, required: true, default: false },
    reraNumber: { type: String, default: null },
    reraCertificate: { type: String, default: null },
    isVerified: { type: Boolean, required: true, default: false },
    sameAdress: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

const cpModel = mongoose.model(
  "channelPartners",
  channelPartnerSchema,
  "channelPartners"
);
export default cpModel;
