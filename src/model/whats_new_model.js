import mongoose from "mongoose";

export const whatsnewSchema = new mongoose.Schema({
  imageName: { type: String, default: null },
  showCaseImage: { type: String, default: null },
});

const whatsnewModel = mongoose.model("whatsnew", whatsnewSchema, "whatsnew");
export default whatsnewModel;
