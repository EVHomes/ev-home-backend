import mongoose from "mongoose";

export const meetingSchema = new mongoose.Schema({
  date: {
    type: Date,
  },
  place: {
    type: String,
    ref: "divisions",
  },
  purpose: {
    type: String,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "clients",
    default: null,
  },
  project: {
    type: String,
    default: null,
    ref: "ourProjects",
  },
  meetingWith: {
    type: String,
    default: null,
    ref: "employees",
  },

  summary: {
    type: String,
  },
  meetingEnd: {
    type: Date,
  },
  lead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "leads",
  },
  postSaleBooking: {
    type:mongoose.Schema.Types.ObjectId,
    ref: "postSaleLead",
  },
});

const meetingModel = mongoose.model("meeting", meetingSchema, "meeting");
export default meetingModel;
