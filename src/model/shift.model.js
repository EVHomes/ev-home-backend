import mongoose from "mongoose";

export const shiftSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    shiftName: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    timeIn: {
      type: String,
      required: true,
    },
    timeOut: {
      type: String,
      required: true,
    },
    multiTimeInOut : {
      type:Boolean,
    },
    workingHours: {
      type: Number, 
      required: true,
    },
    graceTime: {
      type: Number, 
      default: 0,
    },
    status: {
      type: String, 
      default: 'Active',
    },
  },
  { timestamps: true }
);

const shiftModel = mongoose.model("shift", shiftSchema, "shifts");
export default shiftModel;
