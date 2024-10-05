import mongoose from "mongoose";

export const channelPartnerSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, default: null },
    lastName: { type: String, default: null },
    gender: { type: String, required: true },
    firmName: { type: String, required: true },
    homeAddress: { type: String, required: true },
    firmAddress: { type: String, required: true },
    countryCode: { type: String, required: true, unique: true },
    phoneNumber: { type: Number, required: true },
    haveReraRegistration: { type: Boolean, required: true },
    reraNumber: { type: String, default: null },
    reraCertificate: { type: String, default: null },
    isVerified: { type: Boolean, required: true },
  },
  { timestamps: true }
);

const cpModel = mongoose.model("channelPartners", channelPartnerSchema);
export default cpModel;
