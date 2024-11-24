import mongoose from "mongoose";

export const teamSectionSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    section: { type: String, required: true },
    designations: [{ type: String, required: true, ref: "designations" }],
  },
  { timestamps: true }
);

const teamSectionModel = mongoose.model(
  "teamSections",
  teamSectionSchema,
  "teamSections"
);
export default teamSectionModel;
