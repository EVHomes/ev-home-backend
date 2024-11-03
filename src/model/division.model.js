import mongoose from "mongoose";

export const divisionSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  division: { type: String, required: true, unique: true },
  location: { type: String, default: "vashi" },
  name: { type: String, default: "" },
});
const divisionModel = mongoose.model("divisions", divisionSchema, "divisions");
export default divisionModel;
