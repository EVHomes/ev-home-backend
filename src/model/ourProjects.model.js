import mongoose from "mongoose";

export const ourProjectsSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, default: "" },
  showCaseImage: { type: String, required: true },
  carouselImages: [{ type: String, required: true }],
  flatList: [
    {
      name: { type: String, required: true },
      floor: { type: Number, required: true },
      number: { type: Number, required: true },
      flatNo: { type: String, required: true },
      carpetArea: { type: Number, required: true },
      sellableCarpetArea: { type: Number, required: true, default: null },
      allInclusiveValue: { type: Number, required: true, default: null },
      occupied: { type: Boolean, default: false },
      occupiedBy: { type: String, default: null },
    },
  ],
  parkingList: [
    {
      floor: { type: Number, required: true },
      floorName: { type: String, required: true },
      number: { type: Number, required: true },
      ParkingNo: { type: String, required: true },
      occupied: { type: Boolean, default: false },
      occupiedBy: { type: String, default: null },
    },
  ],
  contactNumber: { type: Number, default: null },
  countryCode: { type: String, default: "+91" },
  locationLink: { type: String, default: null },
  locationName: { type: String, required: true },
  brochure: { type: String, default: null },
  govAccount: {
    accountNo: { type: String, default: null },
    ifsc: { type: String, default: null },
    micr: { type: String, default: null },
    bankName: { type: String, default: null },
  },
  businessAccount: {
    accountNo: { type: String, default: null },
    ifsc: { type: String, default: null },
    micr: { type: String, default: null },
    bankName: { type: String, default: null },
  },
  amenities: [
    {
      image: { type: String, required: true },
      name: { type: String, required: true },
    },
  ],
  configurations: [
    {
      carpetArea: { type: String, required: true },
      configuration: { type: String, required: true },
      image: { type: String, required: true },
      price: { type: Number, required: true },
      reraId: { type: String, required: true },
    },
  ],
});
const ourProjectModel = mongoose.model(
  "ourProjects",
  ourProjectsSchema,
  "ourProjects"
);
export default ourProjectModel;
