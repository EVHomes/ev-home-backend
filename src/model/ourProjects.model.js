import mongoose from "mongoose";

export const ourProjectsSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  showCaseImage: { type: String, required: true },
  carouselImages: [{ type: String, required: true }],
  contactNumber: { type: Number, required: true },
  countryCode: { type: String, default: "+91" },
  locationLink: { type: String, required: true },
  locationName: { type: String, required: true },
  brochure: { type: String, default: null },
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
