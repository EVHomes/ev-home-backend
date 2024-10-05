import mongoose from "mongoose";

export const channelPartnerSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    firstName: { type: String, default: null },
    lastName: { type: String, default: null },
    password: { type: String, required: true },
    firmName: { type: String, required: true },
    phoneNumber: { type: Number, required: true },
    countryCode: { type: String, required: true },
  },
  { timestamps: true }
);
const cpModel = mongoose.model("channelPartners", channelPartnerSchema);
export default cpModel;
