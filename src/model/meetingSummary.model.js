import mongoose from "mongoose";

export const meetingSchema = new mongoose.Schema({
  date: {
    type: Date,
  },
  place: {
    type: String,
  },
  purpose: {
    type: String,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "clients",
    default: null,
  },
});

const meetingModel = mongoose.model("meeting", meetingSchema, "meeting");
export default meetingModel;