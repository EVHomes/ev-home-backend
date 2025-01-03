//TODO: shift model
import mongoose from "mongoose";
export const shiftSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    shiftName: {
      type: String,
      default: null,
    },
    type: {
      type: String,
      default: null,
    },
    timeIn: {
      type: String,
      required: true,
    },
    timeOut: {
      type: String,
      required: true,
    },
    shiftHours: {
      type: Number,
      default: null,
    },
    workingHours: {
      type: Number,
      default: null,
    },
    graceTime: {
      type: Number,
      default: 0,
    },
    gracePeriod: {
      type: Number,
      default: 0,
    },
    breakTime: {
      type: Number,
      default: null,
    },
    multiTimeInOut: {
      type: Boolean,
      default: false,
    },
    status: {
      type: Boolean,
      default: false,
    },
    absentMin: {
      type: Number,
      default: false,
    },
    halfDayMin: {
      type: Number,
      default: false,
    },
    fullDayMin: {
      type: Number,
      default: false,
    },
  },
  { timestamps: true }
);

const shiftModel = mongoose.model("shift", shiftSchema, "shifts");
export default shiftModel;
